import { Query, Resolver } from '@nestjs/graphql';

import { BuilderGlobalService } from '../../../service/services/builder-global.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopBuilderGlobalResolver {
    constructor(private builderGlobalService: BuilderGlobalService) {}

    @Query()
    async publishedBuilderGlobals(
        @Ctx() ctx: RequestContext,
    ): Promise<Array<{ region: string; content: string }>> {
        return this.builderGlobalService.getAllPublished(ctx);
    }
}
