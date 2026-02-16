import { Injectable } from '@nestjs/common';
import {
    CreateShopInput,
    CreateThemeInput,
    Permission,
    UpdateShopInput,
    UpdateThemeInput,
} from '@vendure/common/lib/generated-types';
import { ID, Type } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ShopAware, ShopCodeExistsError, ShopNotFoundError } from '../../common';
import { ForbiddenError } from '../../common/error/errors';
import { Instrument } from '../../common/instrument-decorator';
import { createSelfRefreshingCache, SelfRefreshingCache } from '../../common/self-refreshing-cache';
import { ConfigService } from '../../config';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Theme } from '../../entity';
import { VendureEntity } from '../../entity/base/base.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { Shop } from '../../entity/shop/shop.entity';
import defaultTheme from '../../entity/theme/default-theme.json';
import { EventBus } from '../../event-bus';

import { ChannelService } from './channel.service';
import { GlobalSettingsService } from './global-settings.service';
import { PageService } from './page.service';
import { ZoneService } from './zone.service';
/**
 * @description
 * Contains methods relating to {@link Channel} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ShopService {
    private shops: Map<string, SelfRefreshingCache<Shop, [RequestContext]>> = new Map();

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private zoneService: ZoneService,
        private channelService: ChannelService,
        private globalSettingsService: GlobalSettingsService,
        private pageService: PageService,
        private eventBus: EventBus,
    ) {}

    /**
     * Creates a channels cache, that can be used to reduce number of channel queries to database
     *
     * @internal
     */
    async createCache(code: string): Promise<SelfRefreshingCache<Shop, [RequestContext]>> {
        const cache = await createSelfRefreshingCache({
            name: 'ShopService.shops',
            ttl: this.configService.entityOptions.shopCacheTtl,
            refresh: {
                fn: async ctx => {
                    const result = await this.findByCode(ctx, code);
                    if (!result) {
                        throw new ShopNotFoundError(code);
                    }
                    return result;
                },
                defaultArgs: [RequestContext.empty()],
            },
        });

        this.shops.set(code, cache);
        return cache;
    }

    /**
     * Gets the cache entry for the shop
     * Creates a new cache entry if does not exist
     * @internal
     */
    async getCache(shopCode: string): Promise<SelfRefreshingCache<Shop, [RequestContext]>> {
        if (!this.shops.has(shopCode)) return await this.createCache(shopCode);
        // eslint-disable-next-line
        return this.shops.get(shopCode)!;
    }

    /**
     * Refreshes the cache for the Shop
     * @internal
     */
    async refreshCache(ctx: RequestContext): Promise<Shop> {
        const cache = await this.getCache(ctx.shop.code);
        return cache.refresh(ctx);
    }

    /**
     * @description
     * Assigns a ChannelAware entity to the default Channel as well as any channel
     * specified in the RequestContext. This method will not save the entity to the database, but
     * assigns the `channels` property of the entity.
     */
    async assignToShop<T extends ShopAware & VendureEntity>(entity: T, ctx: RequestContext): Promise<T> {
        const shop = await this.getShop(ctx.shop.code);
        entity.shop = shop;
        // await this.eventBus.publish(new ChangeChannelEvent(ctx, entity, [ctx.channelId], 'assigned'));
        return entity;
    }

    /**
     * @description
     * Assigns the entity to the given Channels and saves all changes to the database.
     */
    async assignToShopAndSave<T extends ShopAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        shopId: ID,
    ): Promise<void> {
        await this.connection
            .getRepository(ctx, entityType)
            .createQueryBuilder()
            .relation('shop')
            .of(entityId)
            .set(shopId);

        // await this.eventBus.publish(new ChangeChannelEvent(ctx, entity, channelIds, 'assigned', entityType));
        return;
    }

    /**
     * @description
     * Returns the Shop from cache.
     */
    async getShop(shopCode: string): Promise<Shop> {
        const shopCache = await this.getCache(shopCode);
        return await shopCache.value();
    }

    async getActiveShop(ctx: RequestContext): Promise<Shop> {
        const shop = await this.connection.getRepository(ctx, Shop).findOne({ where: { id: ctx.shopId } });
        if (!shop) {
            throw new ShopNotFoundError(String(ctx.shopId));
        }
        return shop;
    }

    findById(ctx: RequestContext, id: ID): Promise<Shop | undefined> {
        const channelId = ctx.channelId;
        const isSuperAdmin = ctx.userHasPermissions([Permission.SuperAdmin]);

        // if not super admin and channel does not match (true && true)
        // if is super admin (false)
        // if not super admin but channel matches (true && false)
        if (!isSuperAdmin && channelId !== id) throw new ForbiddenError();

        return this.connection
            .getRepository(ctx, Shop)
            .findOne({ where: { id } })
            .then(result => result ?? undefined);
    }

    findByCode(ctx: RequestContext, code: string): Promise<Shop | undefined> {
        return this.connection
            .getRepository(ctx, Shop)
            .findOne({ where: { code } })
            .then(result => result ?? undefined);
    }

    /**
     * @description
     * Registers a new shop and the defaults
     * Returns the RequestContext with the shop and channel
     */
    async registerShop(ctx: RequestContext, input: CreateShopInput): Promise<RequestContext> {
        const shop = await this.create(ctx, input);
        const zone = await this.zoneService.createDefaultZoneAfterRegistration(ctx, shop);
        const channel = await this.channelService.createDefaultChannelAfterRegistration(ctx, shop, zone);
        ctx = ctx.withShopAndChannel(shop, channel);
        await this.pageService.createDefaultPagesAfterRegistration(ctx);
        await this.globalSettingsService.createDefaultGlobalSettinsAfterRegistration(ctx);
        return ctx;
    }

    /**
     * Creates a new shop and returns it
     * Cache is deliberately not created here as the self registering cache refresh function requires a RequestContext
     * and by default it creates an empty context to pass it into the query method
     * But while creating a new shop, usually it is inside a transaction qand while in a transaction, the new reocrd is not yet commited
     * and the query inside the refresh function in cache can not find it
     */
    async create(ctx: RequestContext, input: CreateShopInput): Promise<Shop> {
        const existingShop = await this.findByCode(ctx, input.code);

        if (existingShop) throw new ShopCodeExistsError(input.code);

        const shop = new Shop(input);
        const createdShop = await this.connection.getRepository(ctx, Shop).save(shop);
        return createdShop;
    }

    async updateShop(ctx: RequestContext, input: UpdateShopInput): Promise<Shop> {
        const shop = await this.connection.getRepository(ctx, Shop).findOne({
            where: { id: input.id },
        });
        if (!shop) {
            throw new ShopNotFoundError(String(input.id));
        }
        if (input.name !== undefined) shop.name = input.name;
        if (input.code !== undefined) shop.code = input.code;
        if (input.domain !== undefined) shop.domain = input.domain;
        if (input.description !== undefined) shop.description = input.description;
        if (input.logo !== undefined) shop.logo = input.logo;
        if (input.seoTitle !== undefined) shop.seoTitle = input.seoTitle;
        if (input.seoDescription !== undefined) shop.seoDescription = input.seoDescription;
        const updated = await this.connection.getRepository(ctx, Shop).save(shop);
        await this.refreshCache(ctx);
        return updated;
    }

    async createTheme(ctx: RequestContext, input: CreateThemeInput): Promise<Theme> {
        const theme = new Theme({
            shop: { id: ctx.shopId },
            value: input.value,
        });
        return this.connection.getRepository(ctx, Theme).save(theme);
    }

    async getShopTheme(ctx: RequestContext): Promise<Theme> {
        const theme = await this.connection.getRepository(ctx, Theme).findOne({
            where: { shop: { id: ctx.shopId } },
        });
        if (!theme) {
            return this.createTheme(ctx, { value: defaultTheme });
        }

        return theme;
    }

    async updateTheme(ctx: RequestContext, input: UpdateThemeInput): Promise<Theme> {
        let theme = await this.connection.getRepository(ctx, Theme).findOne({
            where: { shop: { id: ctx.shopId } },
        });
        if (!theme) {
            theme = new Theme({
                shop: { id: ctx.shopId },
            });
        }
        theme.value = input.value;
        return this.connection.getRepository(ctx, Theme).save(theme);
    }

    /**
     * @description
     * Type guard method which returns true if the given entity is an
     * instance of a class which implements the {@link ShopAware} interface.
     */
    public isShopAware(entity: VendureEntity): entity is VendureEntity & ShopAware {
        const entityType = Object.getPrototypeOf(entity).constructor;
        return !!this.connection.rawConnection
            .getMetadata(entityType)
            .relations.find(r => r.type === Shop && r.propertyName === 'shop');
    }
}
