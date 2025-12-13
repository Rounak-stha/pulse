import { Injectable } from '@nestjs/common';
import {
    ConfigurableOperationInput,
    LanguageCode,
    MutationRegisterShopArgs,
} from '@vendure/common/lib/generated-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import { isGraphQlErrorResult } from '../../../common';
import { ConfigService, Logger } from '../../../config';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Channel, Collection, FacetValue, User } from '../../../entity';
import { Shop } from '../../../entity/shop/shop.entity';
import { AuthService, CollectionService, FacetValueService, RequestContextService } from '../../../service';
import { ChannelService } from '../../../service/services/channel.service';
import { CountryService } from '../../../service/services/country.service';
import { SearchService } from '../../../service/services/search.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { ZoneService } from '../../../service/services/zone.service';
import { CollectionFilterDefinition, CountryDefinition, InitialData, ZoneMap } from '../../types';
import { AssetImporter } from '../asset-importer/asset-importer';

/**
 * @description
 * Responsible for populating the database with {@link InitialData}, i.e. non-product data such as countries, tax rates,
 * shipping methods, payment methods & roles.
 *
 * @docsCategory import-export
 */
@Injectable()
export class Populator {
    /** @internal */
    constructor(
        private authService: AuthService,
        private countryService: CountryService,
        private zoneService: ZoneService,
        private channelService: ChannelService,
        private taxRateService: TaxRateService,
        private taxCategoryService: TaxCategoryService,
        private collectionService: CollectionService,
        private facetValueService: FacetValueService,
        private searchService: SearchService,
        private assetImporter: AssetImporter,
        private configService: ConfigService,
        private connection: TransactionalConnection,
        private requestContextService: RequestContextService,
    ) {}

    /**
     * @description
     * Populates the database with a Shop and Admin User
     */
    async populateShopAndAdministrator(data: MutationRegisterShopArgs) {
        const ctx = this.requestContextService.createSystemContext({
            apiType: 'admin',
            languageCode: LanguageCode.en,
        });
        const registerResult = await this.authService.createShopAnAdminUser(ctx, data);
        if (isGraphQlErrorResult(registerResult)) throw registerResult;

        return registerResult;
    }

    /**
     * @description
     * Should be run *before* populating the products, so that there are TaxRates by which
     * product prices can be set. If the `channel` argument is set, then any {@link ChannelAware}
     * entities will be assigned to that Channel.
     */
    async populateInitialData(data: InitialData) {
        const ctx = this.requestContextService.createSystemContext({
            apiType: 'admin',
            languageCode: data.defaultLanguage,
        });
        let zoneMap: ZoneMap;
        try {
            Logger.info('Populating Zones');
            zoneMap = await this.populateCountries(ctx, data.beforeShop.countries);
        } catch (e: any) {
            Logger.error('Could not populate countries');
            Logger.error(e, 'populator', e.stack);
            throw e;
        }
        try {
            Logger.info('Populating Tax Rates');
            await this.populateTaxRates(ctx, data.beforeShop.taxRates, zoneMap);
        } catch (e: any) {
            Logger.error('Could not populate tax rates');
            Logger.error(e, 'populator', e.stack);
        }
    }

    private processFilterDefinition(
        filter: CollectionFilterDefinition,
        allFacetValues: FacetValue[],
    ): ConfigurableOperationInput {
        switch (filter.code) {
            case 'facet-value-filter':
                const facetValueIds = filter.args.facetValueNames
                    .map(name =>
                        allFacetValues.find(fv => {
                            let facetName;
                            let valueName = name;
                            if (name.includes(':')) {
                                [facetName, valueName] = name.split(':');
                                return (
                                    (fv.name === valueName || fv.code === valueName) &&
                                    (fv.facet.name === facetName || fv.facet.code === facetName)
                                );
                            } else {
                                return fv.name === valueName || fv.code === valueName;
                            }
                        }),
                    )
                    .filter(notNullOrUndefined)
                    .map(fv => fv.id);
                return {
                    code: filter.code,
                    arguments: [
                        {
                            name: 'facetValueIds',
                            value: JSON.stringify(facetValueIds),
                        },
                        {
                            name: 'containsAny',
                            value: filter.args.containsAny.toString(),
                        },
                    ],
                };
            default:
                throw new Error(`Filter with code "${filter.code as string}" is not recognized.`);
        }
    }

    private async createRequestContext(shop: Shop, data: InitialData, channel?: Channel) {
        const { superadminCredentials } = this.configService.authOptions;
        const superAdminUser = await this.connection.rawConnection.getRepository(User).findOne({
            where: {
                identifier: superadminCredentials.identifier,
            },
        });
        const ctx = await this.requestContextService.create({
            user: superAdminUser ?? undefined,
            apiType: 'admin',
            languageCode: data.defaultLanguage,
            shopOrCode: shop,
            channelOrToken: channel ?? (await this.channelService.getDefaultChannel(shop)),
        });
        return ctx;
    }

    private async populateCountries(ctx: RequestContext, countries: CountryDefinition[]): Promise<ZoneMap> {
        const zoneMap: ZoneMap = new Map();
        const existingZones = await this.zoneService.getAllWithMembers(ctx);
        for (const zone of existingZones) {
            zoneMap.set(zone.name, { entity: zone, members: zone.members.map(m => m.id) });
        }
        for (const { name, code, zone } of countries) {
            const countryEntity = await this.countryService.create(ctx, {
                code,
                enabled: true,
                translations: [{ languageCode: ctx.languageCode, name }],
            });

            let zoneItem = zoneMap.get(zone);
            if (!zoneItem) {
                const zoneEntity = await this.zoneService.create(ctx, { name: zone });
                zoneItem = { entity: zoneEntity, members: [] };
                zoneMap.set(zone, zoneItem);
            }
            if (!zoneItem.members.includes(countryEntity.id)) {
                zoneItem.members.push(countryEntity.id);
            }
        }

        // add the countries to the respective zones
        for (const zoneItem of zoneMap.values()) {
            await this.zoneService.addMembersToZone(ctx, {
                zoneId: zoneItem.entity.id,
                memberIds: zoneItem.members,
            });
        }

        return zoneMap;
    }

    private async populateTaxRates(
        ctx: RequestContext,
        taxRates: Array<{ name: string; percentage: number }>,
        zoneMap: ZoneMap,
    ) {
        for (const taxRate of taxRates) {
            const category = await this.taxCategoryService.create(ctx, { name: taxRate.name });

            for (const { entity } of zoneMap.values()) {
                await this.taxRateService.create(ctx, {
                    zoneId: entity.id,
                    value: taxRate.percentage,
                    categoryId: category.id,
                    name: `${taxRate.name} ${entity.name}`,
                    enabled: true,
                });
            }
        }
    }

    /**
     * @description
     * Should be run *after* the products have been populated, otherwise the expected FacetValues will not
     * yet exist.
     */
    async populateCollections(shop: Shop, data: InitialData, channel?: Channel) {
        const ctx = await this.createRequestContext(shop, data, channel);

        const allFacetValues = await this.facetValueService.findAll(ctx, ctx.languageCode);
        const collectionMap = new Map<string, Collection>();
        for (const collectionDef of data.afterShop.collections || []) {
            const parent = collectionDef.parentName && collectionMap.get(collectionDef.parentName);
            const parentId = parent ? parent.id.toString() : undefined;
            const { assets } = await this.assetImporter.getAssets(collectionDef.assetPaths || [], ctx);
            let filters: ConfigurableOperationInput[] = [];
            try {
                filters = (collectionDef.filters || []).map(filter =>
                    this.processFilterDefinition(filter, allFacetValues),
                );
            } catch (e: any) {
                Logger.error(e.message);
            }
            const collection = await this.collectionService.create(ctx, {
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: collectionDef.name,
                        description: collectionDef.description || '',
                        slug: collectionDef.slug ?? collectionDef.name,
                    },
                ],
                isPrivate: collectionDef.private || false,
                parentId,
                assetIds: assets.map(a => a.id.toString()),
                featuredAssetId: assets.length ? assets[0].id.toString() : undefined,
                filters,
                inheritFilters: collectionDef.inheritFilters ?? true,
            });
            collectionMap.set(collectionDef.name, collection);
        }
        // Wait for the created collection operations to complete before running
        // the reindex of the search index.
        await new Promise(resolve => setTimeout(resolve, 50));
        await this.searchService.reindex(ctx);
    }
}
