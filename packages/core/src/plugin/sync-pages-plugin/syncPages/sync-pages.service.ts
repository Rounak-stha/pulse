import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { Logger } from '../../../config';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Shop, Page, PageVersion, PageVersionStatus } from '../../../entity/index'
import SystemPages from '../../../entity/page/default-pages.json'
import { Job } from '../../../job-queue/job';
import { JobQueue } from '../../../job-queue/job-queue';
import { JobQueueService } from '../../../job-queue/job-queue.service';

export type SyncPagesJobData = {
    type: 'sync-pages';
};

const SystemPagesMappedBySlug = new Map(SystemPages.map(p => [p.slug, p]));

/**
 * This service is responsible for handling the sync system pages job.
 */
@Injectable()
export class SyncSystemPagesService implements OnApplicationBootstrap {
    private syncSystemPagesQueue: JobQueue<SyncPagesJobData>;

    constructor(
        private jobService: JobQueueService,
        private connection: TransactionalConnection,
    ) {}

    async onApplicationBootstrap() {
        Logger.info('In Sync Pages Plugin onApplicationBootstrap')
        this.syncSystemPagesQueue = await this.jobService.createQueue({
            name: 'sync-system-pages',
            process: async job => {
                if (job.data.type === 'sync-pages') {
                    return this.syncPages(job);
                }
            },
        });
        await this.addSyncJob();
    }

    addSyncJob() {
        Logger.info('Adding Sync Job')
        return this.syncSystemPagesQueue.add(
            {
                type: 'sync-pages',
            },
        );
    }

    private async syncPages(job: Job<SyncPagesJobData>) {
        Logger.info('Syncing Pages')
        // Logic to sync pages will be added here
        // e.g. deserialize context, connect to external source, create pages
        // Placeholder return
        const shops = await this.getShops();
        const pagesToCreate: Page[] = [];

        const pageRepo = this.connection.rawConnection.getRepository(Page);
        const pageVersionRepo = this.connection.rawConnection.getRepository(PageVersion);



        for (const shop of shops) {
            const pages = await this.getShopPages(shop.id);

            const pagesMapBySlug = new Map(pages.map(p => [p.slug, p]));

            for (const page of SystemPages) {
                if (!pagesMapBySlug.has(page.slug)) {
                    pagesToCreate.push(new Page({
                        slug: page.slug,
                        name: page.name,
                        system: true,
                        shop,
                    }));
                }
            }
        }

        const createdPages = await pageRepo.save(pagesToCreate);

        const draftPageVersionsToCreate= createdPages.map(page => ({
            page,
            content: SystemPagesMappedBySlug.get(page.slug)?.content || '',
            versionNumber: 1,
            status: PageVersionStatus.DRAFT,
        }));

        const publishedPageVersionsToCreate = createdPages.map(page => ({
            page,
            content: SystemPagesMappedBySlug.get(page.slug)?.content || '',
            versionNumber: 1,
            status: PageVersionStatus.PUBLISHED,
        }));

        const [savedDrafts, savedPublished] = await Promise.all([pageVersionRepo.save(draftPageVersionsToCreate), pageVersionRepo.save(publishedPageVersionsToCreate)]);

        const draftByPageId = new Map(savedDrafts.map(v => [v.page.id, v]));
        const publishedByPageId = new Map(savedPublished.map(v => [v.page.id, v]));

        const updatedPages = createdPages.map(page => ({
            ...page,
            lastPublishedAt: new Date(),
            draftVersion: draftByPageId.get(page.id),
            publishedVersion: publishedByPageId.get(page.id),
        }));

        await pageRepo.save(updatedPages);
    }

    private async getShops() {
        return this.connection.rawConnection.getRepository(Shop).find();
    }

    private async getShopPages(shopId: ID) {
        return this.connection.rawConnection.getRepository(Page).find({
            where: { shop: { id: shopId } },
        });
    }
}
