import { Injectable } from '@nestjs/common';
import {
    CreateChannelInput,
    CreateChannelResult,
    CurrencyCode,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateChannelInput,
    UpdateChannelResult,
} from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { FindOptionsWhere } from 'typeorm';

import { RelationPaths } from '../../api';
import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_ZONES } from '../../common/constants';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import {
    ChannelNotFoundError,
    EntityNotFoundError,
    ForbiddenError,
    InternalServerError,
    UserInputError,
} from '../../common/error/errors';
import { LanguageNotAvailableError } from '../../common/error/generated-graphql-admin-errors';
import { Instrument } from '../../common/instrument-decorator';
import { createSelfRefreshingCache, SelfRefreshingCache } from '../../common/self-refreshing-cache';
import { ChannelAware, ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { VendureEntity } from '../../entity/base/base.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariantPrice } from '../../entity/product-variant/product-variant-price.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Seller } from '../../entity/seller/seller.entity';
import { Session } from '../../entity/session/session.entity';
import { Shop } from '../../entity/shop/shop.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { EventBus } from '../../event-bus';
import { ChangeChannelEvent } from '../../event-bus/events/change-channel-event';
import { ChannelEvent } from '../../event-bus/events/channel-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';

import { GlobalSettingsService } from './global-settings.service';
import { ZoneService } from './zone.service';
/**
 * @description
 * Contains methods relating to {@link Channel} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ChannelService {
    private allChannels: Map<ID, SelfRefreshingCache<Channel[], [RequestContext]>> = new Map();

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private globalSettingsService: GlobalSettingsService,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
        private zoneService: ZoneService,
    ) {}

    /**
     * When the app is bootstrapped, ensure a default Channel exists and populate the
     * channel lookup array.
     *
     * NOTE: We might not need to initialize this channel service
     * Prev when multi-tenancy thorugh Shop was not added, a default channel would be created
     * But now since a everything must be scoped in a Shop, first we need a Shop and that would have a default Channel
     * @internal
     */
    async initChannels(shop: Shop) {
        await this.ensureDefaultChannelExists(shop);
        await this.ensureCacheExists(shop);
    }

    /**
     * Creates a channels cache, that can be used to reduce number of channel queries to database
     *
     * @internal
     */
    private async createCache(shopId: ID): Promise<SelfRefreshingCache<Channel[], [RequestContext]>> {
        const cache = await createSelfRefreshingCache({
            name: 'ChannelService.allChannels',
            ttl: this.configService.entityOptions.channelCacheTtl,
            refresh: {
                fn: async ctx => {
                    const result = await this.listQueryBuilder
                        .build(
                            Channel,
                            {},
                            {
                                ctx,
                                relations: ['defaultShippingZone', 'defaultTaxZone'],
                                ignoreQueryLimits: true,
                                where: {
                                    shop: { id: shopId },
                                },
                            },
                        )
                        .getManyAndCount()
                        .then(([items, totalItems]) => ({
                            items,
                            totalItems,
                        }));
                    return result.items;
                },
                defaultArgs: [RequestContext.empty()],
            },
        });

        this.allChannels.set(shopId, cache);
        return cache;
    }

    /**
     * Gets the cache entry for the shop
     * Creates a new cache entry if does not exist
     * @internal
     */
    private async getCache(shopId: ID): Promise<SelfRefreshingCache<Channel[], [RequestContext]>> {
        if (!this.allChannels.has(shopId)) return await this.createCache(shopId);
        // eslint-disable-next-line
        return this.allChannels.get(shopId)!;
    }

    /**
     * Refreshes the cache for the Shop
     * Optional parameter Shop is used when Registering a new Administrator
     * @internal
     */
    private async refreshCache(ctx: RequestContext, shop?: Shop): Promise<Channel[]> {
        const cache = await this.createCache(shop?.id || ctx.shop.id);
        return await cache.refresh(ctx);
    }

    /**
     * @description
     * Assigns a ChannelAware entity to the default Channel as well as any channel
     * specified in the RequestContext. This method will not save the entity to the database, but
     * assigns the `channels` property of the entity.
     */
    async assignToCurrentChannel<T extends ChannelAware & VendureEntity>(
        entity: T,
        ctx: RequestContext,
    ): Promise<T> {
        const defaultChannel = await this.getDefaultChannel(ctx.shop);
        const channelIds = unique([ctx.channelId, defaultChannel.id]);
        entity.channels = channelIds.map(id => ({ id })) as any;
        await this.eventBus.publish(new ChangeChannelEvent(ctx, entity, [ctx.channelId], 'assigned'));
        return entity;
    }

    /**
     * This method is used to bypass a bug with Typeorm when working with ManyToMany relationships.
     * For some reason, a regular query does not return all the channels that an entity has.
     * This is a most optimized way to get all the channels that an entity has.
     *
     * @param ctx - The RequestContext object.
     * @param entityType - The type of the entity.
     * @param entityId - The ID of the entity.
     * @returns A promise that resolves to an array of objects, each containing a channel ID.
     * @private
     */
    private async getAssignedEntityChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: T['id'],
    ): Promise<Array<{ channelId: ID }>> {
        const repository = this.connection.getRepository(ctx, entityType);

        const metadata = repository.metadata;
        const channelsRelation = metadata.findRelationWithPropertyPath('channels');

        if (!channelsRelation) {
            throw new InternalServerError(`Could not find the channels relation for entity ${metadata.name}`);
        }

        const junctionTableName = channelsRelation.junctionEntityMetadata?.tableName;
        const junctionColumnName = channelsRelation.junctionEntityMetadata?.columns[0].databaseName;
        const inverseJunctionColumnName =
            channelsRelation.junctionEntityMetadata?.inverseColumns[0].databaseName;

        if (!junctionTableName || !junctionColumnName || !inverseJunctionColumnName) {
            throw new InternalServerError(
                `Could not find necessary join table information for the channels relation of entity ${metadata.name}`,
            );
        }

        return await this.connection
            .getRepository(ctx, entityType)
            .manager.createQueryBuilder()
            .select(`channel.${inverseJunctionColumnName}`, 'channelId')
            .from(junctionTableName, 'channel')
            .where(`channel.${junctionColumnName} = :entityId`, { entityId })
            .execute();
    }

    /**
     * @description
     * Assigns the entity to the given Channels and saves all changes to the database.
     */
    async assignToChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T> {
        const relations = [];
        // This is a work-around for https://github.com/vendure-ecommerce/vendure/issues/1391
        // A better API would be to allow the consumer of this method to supply an entity instance
        // so that this join could be done prior to invoking this method.
        // TODO: overload the assignToChannels method to allow it to take an entity instance
        if (entityType === (Order as any)) {
            relations.push('lines', 'shippingLines');
        }
        const entity = await this.connection.getEntityOrThrow(ctx, entityType, entityId, {
            loadEagerRelations: false,
            relationLoadStrategy: 'query',
            where: {
                id: entityId,
            } as FindOptionsWhere<T>,
            relations,
        });
        const assignedChannels = await this.getAssignedEntityChannels(ctx, entityType, entityId);

        const newChannelIds = channelIds.filter(
            id => !assignedChannels.some(ec => idsAreEqual(ec.channelId, id)),
        );

        await this.connection
            .getRepository(ctx, entityType)
            .createQueryBuilder()
            .relation('channels')
            .of(entity.id)
            .add(newChannelIds);

        await this.eventBus.publish(new ChangeChannelEvent(ctx, entity, channelIds, 'assigned', entityType));
        return entity;
    }

    /**
     * @description
     * Removes the entity from the given Channels and saves.
     */
    async removeFromChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T | undefined> {
        const entity = await this.connection.getRepository(ctx, entityType).findOne({
            loadEagerRelations: false,
            relationLoadStrategy: 'query',
            where: {
                id: entityId,
            } as FindOptionsWhere<T>,
        });
        if (!entity) {
            return;
        }
        const assignedChannels = await this.getAssignedEntityChannels(ctx, entityType, entityId);

        const existingChannelIds = channelIds.filter(id =>
            assignedChannels.some(ec => idsAreEqual(ec.channelId, id)),
        );

        if (!existingChannelIds.length) {
            return;
        }
        await this.connection
            .getRepository(ctx, entityType)
            .createQueryBuilder()
            .relation('channels')
            .of(entity.id)
            .remove(existingChannelIds);
        await this.eventBus.publish(new ChangeChannelEvent(ctx, entity, channelIds, 'removed', entityType));
        return entity;
    }

    /**
     * @description
     * Given a channel token, returns the corresponding Channel if it exists, else will throw
     * a {@link ChannelNotFoundError}.
     */
    async getChannelFromToken(shopId: ID, token: string): Promise<Channel> {
        const cacheEntryForShop = await this.getCache(shopId);
        const allChannels = await cacheEntryForShop.value();
        const channel = allChannels.find(c => c.token === token);
        if (!channel) {
            throw new ChannelNotFoundError(token);
        }
        return channel;
    }

    /**
     * @description
     * Returns the default Channel.
     * NOTE: Default Channel must be scoped per shop
     */
    async getDefaultChannel(shop: Shop): Promise<Channel> {
        const shopId = shop.id;
        let cache = this.allChannels.get(shopId);

        // Should be aleady initialized
        if (!cache) {
            cache = await this.createCache(shop.id);
        }

        const shopChannels = await cache.value();
        const defaultChannel = shopChannels.find(channel => channel.code === DEFAULT_CHANNEL_CODE);

        if (!defaultChannel) {
            throw new InternalServerError('error.default-channel-not-found');
        }
        return defaultChannel;
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Channel>,
        relations?: RelationPaths<Channel>,
    ): Promise<PaginatedList<Channel>> {
        return this.listQueryBuilder
            .build(Channel, options, {
                relations: relations ?? ['defaultShippingZone', 'defaultTaxZone'],
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(ctx: RequestContext, id: ID): Promise<Channel | undefined> {
        const shop = ctx.shop;
        const channelId = ctx.channelId;
        const isSuperAdmin = ctx.userHasPermissions([Permission.SuperAdmin]);

        // if not super admin and channel does not match (true && true)
        // if is super admin (false)
        // if not super admin but channel matches (true && false)
        if (!isSuperAdmin && channelId !== id) throw new ForbiddenError();

        return this.connection
            .getRepository(ctx, Channel)
            .findOne({ where: { id, shop }, relations: ['defaultShippingZone', 'defaultTaxZone'] })
            .then(result => result ?? undefined);
    }

    async createDefaultChannelAfterRegistration(ctx: RequestContext, shop: Shop): Promise<Channel> {
        const defaultCurrencyCode = CurrencyCode.NPR;
        const defaultLanguageCode = ctx.languageCode;
        const code = DEFAULT_CHANNEL_CODE;
        const token = shop.code + code;
        const defaultShippingZone = (await this.zoneService.getAllWithMembers(ctx)).find(
            zone => zone.name === DEFAULT_ZONES.ASIA,
        );

        if (!defaultShippingZone) {
            throw new InternalServerError('error.default-shipping-zone-not-found');
        }

        const channel = new Channel({
            shop,
            code,
            token,
            pricesIncludeTax: true,
            defaultLanguageCode,
            defaultCurrencyCode,
            defaultShippingZone,
            defaultTaxZone: defaultShippingZone,
            availableCurrencyCodes: [defaultCurrencyCode],
            availableLanguageCodes: [defaultLanguageCode],
        });

        const newChannel = await this.connection.getRepository(ctx, Channel).save(channel);
        await this.refreshCache(ctx, shop);
        await this.eventBus.publish(new ChannelEvent(ctx, newChannel, 'created'));
        return newChannel;
    }

    async create(
        ctx: RequestContext,
        input: CreateChannelInput,
    ): Promise<ErrorResultUnion<CreateChannelResult, Channel>> {
        const defaultCurrencyCode = input.defaultCurrencyCode || input.currencyCode;
        const shop = ctx.shop;
        if (!defaultCurrencyCode) {
            throw new UserInputError('Either a defaultCurrencyCode or currencyCode must be provided');
        }
        const channel = new Channel({
            ...input,
            shop,
            defaultCurrencyCode,
            availableCurrencyCodes:
                input.availableCurrencyCodes ?? (defaultCurrencyCode ? [defaultCurrencyCode] : []),
            availableLanguageCodes: input.availableLanguageCodes ?? [input.defaultLanguageCode],
        });
        const defaultLanguageValidationResult = await this.validateDefaultLanguageCode(ctx, input);
        if (isGraphQlErrorResult(defaultLanguageValidationResult)) {
            return defaultLanguageValidationResult;
        }
        if (input.defaultTaxZoneId) {
            channel.defaultTaxZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultTaxZoneId,
            );
        }
        if (input.defaultShippingZoneId) {
            channel.defaultShippingZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultShippingZoneId,
            );
        }
        const newChannel = await this.connection.getRepository(ctx, Channel).save(channel);
        if (input.sellerId) {
            const seller = await this.connection.getEntityOrThrow(ctx, Seller, input.sellerId);
            newChannel.seller = seller;
            await this.connection.getRepository(ctx, Channel).save(newChannel);
        }
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, newChannel);
        await this.refreshCache(ctx);
        await this.eventBus.publish(new ChannelEvent(ctx, newChannel, 'created', input));
        return newChannel;
    }

    async update(
        ctx: RequestContext,
        input: UpdateChannelInput,
    ): Promise<ErrorResultUnion<UpdateChannelResult, Channel>> {
        const channel = await this.findOne(ctx, input.id);
        if (!channel) {
            throw new EntityNotFoundError('Channel', input.id);
        }
        const shop = ctx.shop;
        const originalDefaultCurrencyCode = channel.defaultCurrencyCode;
        const defaultLanguageValidationResult = await this.validateDefaultLanguageCode(ctx, input);
        if (isGraphQlErrorResult(defaultLanguageValidationResult)) {
            return defaultLanguageValidationResult;
        }
        const updatedChannel = patchEntity(channel, input);
        if (input.defaultTaxZoneId) {
            updatedChannel.defaultTaxZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultTaxZoneId,
            );
        }
        if (input.defaultShippingZoneId) {
            updatedChannel.defaultShippingZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultShippingZoneId,
            );
        }
        if (input.sellerId) {
            const seller = await this.connection.getEntityOrThrow(ctx, Seller, input.sellerId);
            updatedChannel.seller = seller;
        }
        if (input.currencyCode) {
            updatedChannel.defaultCurrencyCode = input.currencyCode;
        }
        if (input.currencyCode || input.defaultCurrencyCode) {
            const newCurrencyCode = input.defaultCurrencyCode || input.currencyCode;
            updatedChannel.availableCurrencyCodes = unique([
                ...updatedChannel.availableCurrencyCodes,
                updatedChannel.defaultCurrencyCode,
            ]);
            if (originalDefaultCurrencyCode !== newCurrencyCode) {
                // When updating the default currency code for a Channel, we also need to update
                // and ProductVariantPrices in that channel which use the old currency code.
                const [selectQbQuery, selectQbParams] = this.connection
                    .getRepository(ctx, ProductVariant)
                    .createQueryBuilder('variant')
                    .select('variant.id', 'id')
                    .innerJoin(ProductVariantPrice, 'pvp', 'pvp.variantId = variant.id')
                    .andWhere('pvp.channelId = :channelId')
                    .andWhere('pvp.currencyCode = :newCurrencyCode')
                    .groupBy('variant.id')
                    .getQueryAndParameters();

                const qb = this.connection
                    .getRepository(ctx, ProductVariantPrice)
                    .createQueryBuilder('pvp')
                    .update()
                    .where('channelId = :channelId')
                    .andWhere('currencyCode = :oldCurrencyCode')
                    .set({ currencyCode: newCurrencyCode })
                    .setParameters({
                        channelId: channel.id,
                        oldCurrencyCode: originalDefaultCurrencyCode,
                        newCurrencyCode,
                    });

                if (this.connection.rawConnection.options.type === 'mysql') {
                    // MySQL does not support sub-queries joining the table that is being updated,
                    // it will cause a "You can't specify target table 'product_variant_price' for update in FROM clause" error.
                    // This is a work-around from https://stackoverflow.com/a/9843719/772859
                    qb.andWhere(
                        `variantId NOT IN (SELECT id FROM (${selectQbQuery}) as temp)`,
                        selectQbParams,
                    );
                } else {
                    qb.andWhere(`variantId NOT IN (${selectQbQuery})`, selectQbParams);
                }
                await qb.execute();
            }
        }
        if (
            input.availableCurrencyCodes &&
            !updatedChannel.availableCurrencyCodes.includes(updatedChannel.defaultCurrencyCode)
        ) {
            throw new UserInputError(`error.available-currency-codes-must-include-default`, {
                defaultCurrencyCode: updatedChannel.defaultCurrencyCode,
            });
        }
        await this.connection.getRepository(ctx, Channel).save(updatedChannel, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, updatedChannel);
        await this.refreshCache(ctx);
        await this.eventBus.publish(new ChannelEvent(ctx, channel, 'updated', input));
        return assertFound(this.findOne(ctx, channel.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const channel = await this.connection.getEntityOrThrow(ctx, Channel, id);
        if (channel.code === DEFAULT_CHANNEL_CODE)
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('error.cannot-delete-default-channel'),
            };

        const deletedChannel = new Channel(channel);
        await this.connection.getRepository(ctx, Session).delete({ activeChannelId: id });
        await this.connection.getRepository(ctx, Channel).delete(id);
        await this.connection.getRepository(ctx, ProductVariantPrice).delete({
            channelId: id,
        });
        await this.eventBus.publish(new ChannelEvent(ctx, deletedChannel, 'deleted', id));

        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * Type guard method which returns true if the given entity is an
     * instance of a class which implements the {@link ChannelAware} interface.
     */
    public isChannelAware(entity: VendureEntity): entity is VendureEntity & ChannelAware {
        const entityType = Object.getPrototypeOf(entity).constructor;
        return !!this.connection.rawConnection
            .getMetadata(entityType)
            .relations.find(r => r.type === Channel && r.propertyName === 'channels');
    }

    /**
     * Ensures channel cache exists. If not, this method creates one.
     */
    private async ensureCacheExists(shop: Shop) {
        if (this.allChannels.has(shop.id)) {
            return;
        }

        this.allChannels.set(shop.id, await this.createCache(shop.id));
    }

    /**
     * There must always be a default Channel. If none yet exists, this method creates one.
     * Also ensures the default Channel token matches the defaultChannelToken config setting.
     */
    private async ensureDefaultChannelExists(shop: Shop) {
        const { defaultChannelToken } = this.configService;
        let defaultChannel = await this.connection.rawConnection.getRepository(Channel).findOne({
            where: {
                shop,
                code: DEFAULT_CHANNEL_CODE,
            },
            relations: ['seller'],
        });

        if (!defaultChannel) {
            defaultChannel = new Channel({
                shop,
                code: DEFAULT_CHANNEL_CODE,
                defaultLanguageCode: this.configService.defaultLanguageCode,
                availableLanguageCodes: [this.configService.defaultLanguageCode],
                pricesIncludeTax: false,
                defaultCurrencyCode: CurrencyCode.USD,
                availableCurrencyCodes: [CurrencyCode.USD],
                token: defaultChannelToken,
            });
        } else if (defaultChannelToken && defaultChannel.token !== defaultChannelToken) {
            defaultChannel.token = defaultChannelToken;
            await this.connection.rawConnection
                .getRepository(Channel)
                .save(defaultChannel, { reload: false });
        }
        if (!defaultChannel.seller) {
            const seller = await this.connection.rawConnection.getRepository(Seller).find();
            if (seller.length === 0) {
                throw new InternalServerError('No Sellers were found. Could not initialize default Channel.');
            }
            defaultChannel.seller = seller[0];
            await this.connection.rawConnection
                .getRepository(Channel)
                .save(defaultChannel, { reload: false });
        }
    }

    private async validateDefaultLanguageCode(
        ctx: RequestContext,
        input: CreateChannelInput | UpdateChannelInput,
    ): Promise<LanguageNotAvailableError | undefined> {
        if (input.defaultLanguageCode) {
            const availableLanguageCodes = await this.globalSettingsService
                .getSettings(ctx)
                .then(s => s.availableLanguages);
            if (!availableLanguageCodes.includes(input.defaultLanguageCode)) {
                return new LanguageNotAvailableError({ languageCode: input.defaultLanguageCode });
            }
        }
    }
}
