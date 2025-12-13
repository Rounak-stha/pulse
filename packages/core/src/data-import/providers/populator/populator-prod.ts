import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config';
import { RequestContextService } from '../../../service';
import { CountryService } from '../../../service/services/country.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { ZoneService } from '../../../service/services/zone.service';
import { CountryDefinition, InitialDataProd, ZoneMap } from '../../types';

/**
 * @description
 * Responsible for populating the database with {@link InitialData}, i.e. non-product data such as countries, tax rates,
 * shipping methods, payment methods & roles.
 *
 * @docsCategory import-export
 */
@Injectable()
export class PopulatorProd {
    /** @internal */
    constructor(
        private countryService: CountryService,
        private zoneService: ZoneService,
        private taxRateService: TaxRateService,
        private taxCategoryService: TaxCategoryService,
        private requestContextService: RequestContextService,
    ) {}

    /**
     * @description
     * Populate Initial Data in the prod server
     */
    async populateInitialData(data: InitialDataProd) {
        const ctx = this.requestContextService.createSystemContext({
            apiType: 'admin',
            languageCode: data.defaultLanguage,
        });
        let zoneMap: ZoneMap;
        try {
            Logger.info('Populating Zones');
            zoneMap = await this.populateCountries(ctx, data.countries);
        } catch (e: any) {
            Logger.error('Could not populate countries');
            Logger.error(e, 'populator', e.stack);
            throw e;
        }
        try {
            Logger.info('Populating Tax Rates');
            await this.populateTaxRates(ctx, data.taxRates, zoneMap);
        } catch (e: any) {
            Logger.error('Could not populate tax rates');
            Logger.error(e, 'populator', e.stack);
        }
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
}
