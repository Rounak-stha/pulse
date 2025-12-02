// src/plugins/page-builder/entities/page-version.entity.ts
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';

import { Administrator } from '../administrator/administrator.entity';
import { VendureEntity } from '../base/base.entity';

import { Page } from './page.entity';

export enum PageVersionStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

@Entity()
export class PageVersion extends VendureEntity {
    constructor(input?: DeepPartial<PageVersion>) {
        super(input);
    }

    @ManyToOne(() => Page, page => page.versions, { onDelete: 'CASCADE' })
    @Index()
    page: Page;

    @Column({ type: 'int', default: 1 })
    versionNumber: number;

    @Column('text')
    content: string; // Compressed Craft.js state

    @Column('simple-json', { nullable: true })
    theme: string; // Theme configuration

    @Column({
        type: 'varchar',
        default: PageVersionStatus.DRAFT,
    })
    status: PageVersionStatus;

    @OneToOne(() => Administrator)
    publishedBy: Administrator;

    @Column({ type: process.env.DB === 'postgres' ? 'timestamp' : 'datetime', nullable: true })
    publishedAt: Date | null;

    @Column({ nullable: true })
    changeDescription: string; // Optional: describe what changed
}
