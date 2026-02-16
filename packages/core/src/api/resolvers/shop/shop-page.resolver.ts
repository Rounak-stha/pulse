import { Args, Query, Resolver } from '@nestjs/graphql';

import { Page } from '../../../entity/page/page.entity';
import { Shop } from '../../../entity/shop/shop.entity';
import { Theme } from '../../../entity/theme/theme.entity';
import { PageService } from '../../../service/services/page.service';
import { ShopService } from '../../../service/services/shop.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopPageResolver {
    constructor(
        private pageService: PageService,
        private shopService: ShopService,
    ) {}

    @Query()
    async pageBySlug(
        @Ctx() ctx: RequestContext,
        @Args() args: { slug: string },
        @Relations({ entity: Page }) relations: RelationPaths<Page>,
    ): Promise<Page | null> {
        return this.pageService.findOneBySlug(ctx, args.slug, relations);
    }

    @Query()
    async theme(@Ctx() ctx: RequestContext): Promise<Theme> {
        return this.shopService.getShopTheme(ctx);
    }

    @Query()
    async activeShop(@Ctx() ctx: RequestContext): Promise<Shop> {
        return this.shopService.getActiveShop(ctx);
    }
}
