import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../api/common/request-context';
import { TransactionalConnection } from '../../connection';
import { BuilderGlobal } from '../../entity/builder-global/builder-global.entity';
import { EventBus } from '../../event-bus';
import { BuilderGlobalPublishEvent } from '../../event-bus/events/builder-global-publish-event';

@Injectable()
export class BuilderGlobalService {
    constructor(
        private connection: TransactionalConnection,
        private eventBus: EventBus,
    ) {}

    async findByRegion(ctx: RequestContext, region: string): Promise<BuilderGlobal | null> {
        return this.connection.getRepository(ctx, BuilderGlobal).findOne({
            where: { shop: { id: ctx.shopId }, region },
        });
    }

    async findAll(ctx: RequestContext): Promise<BuilderGlobal[]> {
        return this.connection.getRepository(ctx, BuilderGlobal).find({
            where: { shop: { id: ctx.shopId } },
        });
    }

    async saveDraft(
        ctx: RequestContext,
        input: { region: string; content: string },
    ): Promise<BuilderGlobal> {
        let global = await this.findByRegion(ctx, input.region);
        if (!global) {
            global = new BuilderGlobal({
                shop: { id: ctx.shopId } as any,
                region: input.region,
                draftContent: input.content,
            });
        } else {
            global.draftContent = input.content;
        }
        return this.connection.getRepository(ctx, BuilderGlobal).save(global);
    }

    async publish(
        ctx: RequestContext,
        input: { region: string; content: string },
    ): Promise<BuilderGlobal> {
        let global = await this.findByRegion(ctx, input.region);
        if (!global) {
            global = new BuilderGlobal({
                shop: { id: ctx.shopId } as any,
                region: input.region,
                content: input.content,
                draftContent: input.content,
            });
        } else {
            global.content = input.content;
            global.draftContent = input.content;
        }
        const saved = await this.connection.getRepository(ctx, BuilderGlobal).save(global);
        await this.eventBus.publish(new BuilderGlobalPublishEvent(ctx, saved));
        return saved;
    }

    async getAllPublished(
        ctx: RequestContext,
    ): Promise<Array<{ region: string; content: string }>> {
        const globals = await this.findAll(ctx);
        return globals
            .filter(g => g.content)
            .map(g => ({ region: g.region, content: g.content }));
    }
}
