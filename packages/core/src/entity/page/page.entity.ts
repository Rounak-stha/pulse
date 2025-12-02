// src/plugins/page-builder/entities/page.entity.ts
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { ShopAware } from '../../common';
import { VendureEntity } from '../base/base.entity';
import { Shop } from '../shop/shop.entity';

import { PageVersion } from './page-version.entity';

@Entity()
export class Page extends VendureEntity implements ShopAware {
    constructor(input?: DeepPartial<Page>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop, { onDelete: 'CASCADE' })
    shop: Shop;

    @Column()
    name: string;

    @Column({ unique: true })
    @Index()
    slug: string;

    @Column({ nullable: true })
    description: string;

    // Reference to the currently published version
    @ManyToOne(() => PageVersion, { nullable: true })
    publishedVersion: PageVersion | null;

    // Reference to the latest draft version
    @ManyToOne(() => PageVersion, { nullable: true })
    draftVersion: PageVersion | null;

    @OneToMany(() => PageVersion, version => version.page)
    versions: PageVersion[];

    @Column({ type: process.env.DB === 'postgres' ? 'timestamp' : 'datetime', nullable: true })
    lastPublishedAt: Date | null;
}
