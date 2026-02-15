import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';

import { BuilderGlobal } from '../../../entity/builder-global/builder-global.entity';
import { BuilderGlobalService } from '../../../service/services/builder-global.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver()
export class BuilderGlobalResolver {
    constructor(private builderGlobalService: BuilderGlobalService) {}

    @Query()
    @Allow(Permission.ReadPage)
    async builderGlobal(
        @Ctx() ctx: RequestContext,
        @Args() args: { region: string },
    ): Promise<BuilderGlobal | null> {
        return this.builderGlobalService.findByRegion(ctx, args.region);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async builderGlobals(@Ctx() ctx: RequestContext): Promise<BuilderGlobal[]> {
        return this.builderGlobalService.findAll(ctx);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async saveBuilderGlobalDraft(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: { region: string; content: string } },
    ): Promise<BuilderGlobal> {
        return this.builderGlobalService.saveDraft(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async publishBuilderGlobal(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: { region: string; content: string } },
    ): Promise<BuilderGlobal> {
        return this.builderGlobalService.publish(ctx, args.input);
    }
}
