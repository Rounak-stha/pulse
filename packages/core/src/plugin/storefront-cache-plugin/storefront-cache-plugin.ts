import { OnApplicationBootstrap } from '@nestjs/common';
import { filter } from 'rxjs/operators';

import { Logger } from '../../config';
import { EventBus } from '../../event-bus/event-bus';
import { BuilderGlobalPublishEvent } from '../../event-bus/events/builder-global-publish-event';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { PagePublishEvent } from '../../event-bus/events/page-publish-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

export interface StorefrontCachePluginOptions {
    /**
     * The shared secret used to authenticate revalidation requests.
     * Defaults to the `REVALIDATE_SECRET` environment variable.
     */
    revalidateSecret?: string;
    /**
     * The root domain used to construct the storefront URL per shop.
     * The storefront URL is built as `https://{shopCode}.{rootDomain}`.
     * Defaults to the `ROOT_DOMAIN` environment variable.
     */
    rootDomain?: string;
}

const loggerCtx = 'StorefrontCachePlugin';

@VendurePlugin({
    imports: [PluginCommonModule],
    compatibility: '^3.0.0',
})
export class StorefrontCachePlugin implements OnApplicationBootstrap {
    private static options: StorefrontCachePluginOptions = {};

    static init(options: StorefrontCachePluginOptions = {}) {
        this.options = options;
        return this;
    }

    private readonly rootDomain: string;
    private readonly revalidateSecret: string;

    constructor(private eventBus: EventBus) {
        const opts = StorefrontCachePlugin.options;
        this.rootDomain = opts.rootDomain || process.env.ROOT_DOMAIN || '';
        this.revalidateSecret = opts.revalidateSecret || process.env.REVALIDATE_SECRET || '';
    }

    onApplicationBootstrap() {
        if (!this.rootDomain || !this.revalidateSecret) {
            Logger.warn(
                'StorefrontCachePlugin is not configured. Set ROOT_DOMAIN and REVALIDATE_SECRET environment variables, ' +
                    'or pass them via StorefrontCachePlugin.init({ rootDomain, revalidateSecret }).',
                loggerCtx,
            );
            return;
        }

        this.eventBus.ofType(PagePublishEvent).subscribe(event => {
            const shopCode = event.ctx.shop.code;
            void this.revalidate(shopCode, [`page:${event.page.slug}`, `shop:${shopCode}`]);
        });

        this.eventBus.ofType(BuilderGlobalPublishEvent).subscribe(event => {
            const shopCode = event.ctx.shop.code;
            void this.revalidate(shopCode, ['globals', `shop:${shopCode}`]);
        });

        this.eventBus
            .ofType(ProductEvent)
            .pipe(filter(event => event.type === 'updated' || event.type === 'deleted'))
            .subscribe(event => {
                const shopCode = event.ctx.shop.code;
                void this.revalidate(shopCode, [
                    'products',
                    `product:${event.entity.id}`,
                    `shop:${shopCode}`,
                ]);
            });

        this.eventBus
            .ofType(ProductVariantEvent)
            .pipe(filter(event => event.type === 'updated' || event.type === 'deleted'))
            .subscribe(event => {
                const shopCode = event.ctx.shop.code;
                void this.revalidate(shopCode, ['products', `shop:${shopCode}`]);
            });

        this.eventBus.ofType(CollectionModificationEvent).subscribe(event => {
            const shopCode = event.ctx.shop.code;
            void this.revalidate(shopCode, ['collections', `shop:${shopCode}`]);
        });

        Logger.info('Storefront cache revalidation listeners registered', loggerCtx);
    }

    private async revalidate(shopCode: string, tags: string[]) {
        const url = `https://${shopCode}.${this.rootDomain}/api/revalidate`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-revalidate-secret': this.revalidateSecret,
                },
                body: JSON.stringify({ tags }),
            });
            if (!response.ok) {
                const body = await response.text();
                Logger.error(`Revalidation failed (${response.status}): ${body}`, loggerCtx);
            } else {
                Logger.verbose(`Revalidated tags: ${tags.join(', ')}`, loggerCtx);
            }
        } catch (err: unknown) {
            Logger.error(`Revalidation request failed: ${(err as Error).message}`, loggerCtx);
        }
    }
}
