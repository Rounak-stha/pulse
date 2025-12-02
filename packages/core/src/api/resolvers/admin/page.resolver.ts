import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreatePageArgs,
    MutationCreateThemeArgs,
    MutationPublishPageArgs,
    MutationRestorePageVersionArgs,
    MutationSavePageDraftArgs,
    MutationUpdatePageArgs,
    MutationUpdateThemeArgs,
    Permission,
    PublishedPage,
    QueryPageArgs,
    QueryPagesArgs,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { UserInputError } from '../../../common';
import { Theme } from '../../../entity';
import { PageVersion } from '../../../entity/page/page-version.entity';
import { Page } from '../../../entity/page/page.entity';
import { PageService } from '../../../service/services/page.service';
import { ShopService } from '../../../service/services/shop.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver()
export class PageResolver {
    constructor(
        private pageService: PageService,
        private shopService: ShopService,
    ) {}

    @Query()
    async publishedPage(
        @Ctx() ctx: RequestContext,
        @Args() args: { slug: string },
    ): Promise<PublishedPage | null> {
        return this.pageService.getPublishedPageBySlug(ctx, args.slug);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async pages(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryPagesArgs,
        @Relations({ entity: Page }) relations: RelationPaths<Page>,
    ): Promise<PaginatedList<Page>> {
        return this.pageService.findAll(ctx, args.options || undefined, relations);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async page(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryPageArgs,
        @Relations({ entity: Page }) relations: RelationPaths<Page>,
    ): Promise<Page | null> {
        if (args.id) {
            const page = await this.pageService.findOne(ctx, args.id, relations);
            return page;
        } else {
            throw new UserInputError('error.page-id-or-slug-must-be-provided');
        }
    }

    @Query()
    @Allow(Permission.ReadPage)
    async pageBySlug(
        @Ctx() ctx: RequestContext,
        @Args() args: { slug: string },
        @Relations({ entity: Page }) relations: RelationPaths<Page>,
    ): Promise<Page | null> {
        return this.pageService.findOneBySlug(ctx, args.slug, relations);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async pageVersion(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<PageVersion | null> {
        return this.pageService.getVersion(ctx, args.id);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async pageVersions(@Ctx() ctx: RequestContext, @Args() args: { pageId: ID }): Promise<PageVersion[]> {
        return this.pageService.getVersions(ctx, args.pageId);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async pageDraftVersion(
        @Ctx() ctx: RequestContext,
        @Args() args: { pageId: ID },
    ): Promise<PageVersion | null> {
        return this.pageService.getDraftVersion(ctx, args.pageId);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreatePage)
    async createPage(@Ctx() ctx: RequestContext, @Args() args: MutationCreatePageArgs): Promise<Page> {
        return this.pageService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async updatePage(@Ctx() ctx: RequestContext, @Args() args: MutationUpdatePageArgs): Promise<Page> {
        return this.pageService.update(ctx, args.input);
    }

    @Query()
    @Allow(Permission.ReadPage)
    async theme(@Ctx() ctx: RequestContext): Promise<Theme> {
        return this.shopService.getShopTheme(ctx);
    }

    @Mutation()
    @Allow(Permission.UpdatePage)
    async updateTheme(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateThemeArgs): Promise<Theme> {
        return await this.shopService.updateTheme(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdatePage)
    async createTheme(@Ctx() ctx: RequestContext, @Args() args: MutationCreateThemeArgs): Promise<Theme> {
        return await this.shopService.createTheme(ctx, args.input);
    }

    /* @Transaction()
    @Mutation()
    @Allow(Permission.DeletePage)
    async deletePage(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
    ): Promise<DeletionResponse> {
        const result = await this.pageService.delete(ctx, args.id);
        return {
            result: result ? 'DELETED' : 'NOT_DELETED',
            message: result ? 'Page deleted successfully' : 'Page not found',
        };
    } */

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async savePageDraft(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationSavePageDraftArgs,
    ): Promise<PageVersion> {
        return this.pageService.saveDraft(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async publishPage(@Ctx() ctx: RequestContext, @Args() args: MutationPublishPageArgs): Promise<Page> {
        return this.pageService.publish(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdatePage)
    async restorePageVersion(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRestorePageVersionArgs,
    ): Promise<PageVersion> {
        return this.pageService.restoreVersion(ctx, args.input);
    }

    /* @Transaction()
    @Mutation()
    @Allow(Permission.DeletePage)
    async deletePageVersion(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
    ): Promise<DeletionResponse> {
        const result = await this.pageService.deleteVersion(ctx, args.id);
        return {
            result: result ? 'DELETED' : 'NOT_DELETED',
            message: result ? 'Version deleted successfully' : 'Version not found',
        };
    } */
}
