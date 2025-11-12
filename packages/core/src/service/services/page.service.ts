import { Injectable } from '@nestjs/common';
import {
    CreatePageInput,
    PublishedPage,
    PublishPageInput,
    RestorePageVersionInput,
    SavePageVersionInput,
    UpdatePageInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { UserInputError } from '../../common';
import { ListQueryOptions } from '../../common/types/common-types';
import { Logger } from '../../config';
import { TransactionalConnection } from '../../connection';
import { PageVersion, PageVersionStatus } from '../../entity/page/page-version.entity';
import { Page } from '../../entity/page/page.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';

@Injectable()
export class PageService {
    private readonly relations = ['versions', 'shop', 'publishedVersion', 'draftVersion'];

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Page>,
        relations?: RelationPaths<Page>,
    ): Promise<PaginatedList<Page>> {
        const effectiveRelations = relations || this.relations.slice();

        const pageList = await this.listQueryBuilder
            .build(Page, options, {
                relations: effectiveRelations,
                where: { shop: { id: ctx.shopId } },
                ctx,
            })
            .getManyAndCount()
            .then(([pages, totalItems]) => {
                return {
                    items: pages,
                    totalItems,
                };
            });
        return pageList || [];
    }

    async findOne(ctx: RequestContext, pageId: ID, relations?: RelationPaths<Page>): Promise<Page | null> {
        const effectiveRelations = relations ?? this.relations.slice();
        Logger.info(JSON.stringify({ pageId, effectiveRelations }));
        return this.connection.getRepository(ctx, Page).findOne({
            where: { id: pageId, shop: { id: ctx.shopId } },
            relations: effectiveRelations,
        });
    }

    async findOneBySlug(
        ctx: RequestContext,
        slug: string,
        relations?: RelationPaths<Page>,
    ): Promise<Page | null> {
        const effectiveRelations = relations ?? this.relations.slice();
        return this.connection.getRepository(ctx, Page).findOne({
            relations: effectiveRelations,
            where: {
                slug,
                shop: { id: ctx.shopId },
            },
        });
    }

    async create(ctx: RequestContext, input: CreatePageInput): Promise<Page> {
        const page = new Page({
            name: input.name,
            slug: input.slug,
            description: input.description,
            shop: { id: ctx.shopId },
        });

        const savedPage = await this.connection.getRepository(ctx, Page).save(page);

        // Create initial draft version
        const draftVersion = new PageVersion({
            page: new Page({ id: savedPage.id }),
            versionNumber: 1,
            content: '',
            status: PageVersionStatus.DRAFT,
        });

        const savedVersion = await this.connection.getRepository(ctx, PageVersion).save(draftVersion);

        savedPage.draftVersion = savedVersion;
        await this.connection.getRepository(ctx, Page).save(savedPage);
        return savedPage;
    }

    async update(ctx: RequestContext, input: UpdatePageInput): Promise<Page> {
        const page = await this.findOne(ctx, input.id);
        if (!page) {
            throw new UserInputError('error.page-not-found');
        }

        if (input.name !== undefined) page.name = input.name;
        if (input.slug !== undefined) page.slug = input.slug;
        if (input.description !== undefined) page.description = input.description;

        return this.connection.getRepository(ctx, Page).save(page);
    }

    async delete(ctx: RequestContext, id: ID): Promise<boolean> {
        const page = await this.findOne(ctx, id);
        if (!page) {
            throw new UserInputError('error.page-not-found');
        }

        const result = await this.connection.getRepository(ctx, Page).delete(id);
        return !!result.affected;
    }

    async getPublishedVersion(ctx: RequestContext, pageId: ID): Promise<PageVersion | null> {
        const page = await this.findOne(ctx, pageId);
        if (!page?.publishedVersion) {
            return null;
        }

        return this.connection.getRepository(ctx, PageVersion).findOne({
            where: { id: page.publishedVersion.id },
        });
    }

    async getDraftVersion(ctx: RequestContext, pageId: ID): Promise<PageVersion | null> {
        const page = await this.findOne(ctx, pageId);
        if (!page) {
            return null;
        }

        if (page.draftVersion) {
            return this.connection.getRepository(ctx, PageVersion).findOne({
                where: { id: page.draftVersion.id },
            });
        }

        // No draft exists, return published version to start from
        if (page.publishedVersion) {
            return this.connection.getRepository(ctx, PageVersion).findOne({
                where: { id: page.publishedVersion.id },
            });
        }

        return null;
    }

    async getVersions(ctx: RequestContext, pageId: ID): Promise<PageVersion[]> {
        return this.connection.getRepository(ctx, PageVersion).find({
            where: { page: { id: pageId } },
            order: { versionNumber: 'DESC' },
        });
    }

    async getVersion(ctx: RequestContext, versionId: ID): Promise<PageVersion | null> {
        return this.connection.getRepository(ctx, PageVersion).findOne({
            where: { id: versionId },
            relations: ['page'],
        });
    }

    async saveDraft(ctx: RequestContext, input: SavePageVersionInput): Promise<PageVersion> {
        const page = await this.findOne(ctx, input.pageId);
        if (!page) {
            throw new UserInputError('error.page-not-found');
        }

        const latestVersion = await this.connection.getRepository(ctx, PageVersion).findOne({
            where: { page: { id: input.pageId } },
            order: { versionNumber: 'DESC' },
        });

        const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

        const newVersion = new PageVersion({
            page: new Page({ id: input.pageId }),
            versionNumber: newVersionNumber,
            content: input.content,
            theme: input.theme,
            status: PageVersionStatus.DRAFT,
            changeDescription: input.changeDescription,
        });

        const savedVersion = await this.connection.getRepository(ctx, PageVersion).save(newVersion);

        page.draftVersion = new PageVersion({ id: savedVersion.id });
        await this.connection.getRepository(ctx, Page).save(page);

        return savedVersion;
    }

    async publish(ctx: RequestContext, input: PublishPageInput): Promise<Page> {
        const page = await this.findOne(ctx, input.pageId);
        if (!page) {
            throw new UserInputError('error.page-not-found');
        }

        const versionId = input.versionId || page.draftVersion?.id;
        if (!versionId) {
            throw new UserInputError('error.no-version-to-publish');
        }

        const version = await this.connection.getRepository(ctx, PageVersion).findOne({
            where: { id: versionId },
        });

        if (!version) {
            throw new UserInputError('error.version-not-found');
        }

        // Archive old published version
        if (page.publishedVersion) {
            const oldPublished = await this.connection.getRepository(ctx, PageVersion).findOne({
                where: { id: page.publishedVersion.id },
            });
            if (oldPublished) {
                oldPublished.status = PageVersionStatus.ARCHIVED;
                await this.connection.getRepository(ctx, PageVersion).save(oldPublished);
            }
        }

        // Mark version as published
        version.status = PageVersionStatus.PUBLISHED;
        version.publishedAt = new Date();
        await this.connection.getRepository(ctx, PageVersion).save(version);

        // Update page references
        page.publishedVersion = new PageVersion({ id: version.id });
        page.lastPublishedAt = new Date();
        page.draftVersion = null;
        await this.connection.getRepository(ctx, Page).save(page);

        return page;
    }

    async restoreVersion(ctx: RequestContext, input: RestorePageVersionInput): Promise<PageVersion> {
        const version = await this.getVersion(ctx, input.versionId);
        if (!version) {
            throw new UserInputError('error.version-not-found');
        }

        // Create new draft from archived version
        const latestVersion = await this.connection.getRepository(ctx, PageVersion).findOne({
            where: { page: { id: version.page.id } },
            order: { versionNumber: 'DESC' },
        });

        const newVersion = new PageVersion({
            page: new Page({ id: version.page.id }),
            versionNumber: latestVersion ? latestVersion.versionNumber + 1 : 1,
            content: version.content,
            theme: version.theme,
            status: PageVersionStatus.DRAFT,
            changeDescription: input.changeDescription || `Restored from version ${version.versionNumber}`,
        });

        const savedVersion = await this.connection.getRepository(ctx, PageVersion).save(newVersion);

        const page = await this.findOne(ctx, version.page.id);
        if (page) {
            page.draftVersion = new PageVersion({ id: savedVersion.id });
            await this.connection.getRepository(ctx, Page).save(page);
        }

        return savedVersion;
    }

    async deleteVersion(ctx: RequestContext, versionId: ID): Promise<boolean> {
        const version = await this.getVersion(ctx, versionId);
        if (!version) {
            throw new UserInputError('error.version-not-found');
        }

        if (version.status === PageVersionStatus.PUBLISHED) {
            throw new UserInputError('error.cannot-delete-published-version');
        }

        const result = await this.connection.getRepository(ctx, PageVersion).delete(versionId);
        return !!result.affected;
    }

    // Public API - get published page by slug
    async getPublishedPageBySlug(ctx: RequestContext, slug: string): Promise<PublishedPage | null> {
        const page = await this.findOneBySlug(ctx, slug);
        if (!page?.publishedVersion) {
            return null;
        }

        const version = await this.connection.getRepository(ctx, PageVersion).findOne({
            where: { id: page.publishedVersion.id },
        });

        if (!version) {
            return null;
        }

        return {
            id: page.id,
            name: page.name,
            slug: page.slug,
            description: page.description,
            content: version.content,
            theme: version.theme,
            publishedAt: version.publishedAt,
        };
    }
}
