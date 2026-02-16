import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

/**
 * @description
 * Represents a single, independent store.
 * It serves as a logical container for a merchant's business,
 * associating their products, orders, and specific business configurations.
 * This entity is central to tenant isolation,
 * ensuring that all data—such as products and orders—are scoped to a specific shop ID,
 * thereby preventing data from one merchant from being accessed by another.
 *
 * @docsCategory entities
 */
@Entity()
export class Shop extends VendureEntity {
    constructor(input?: DeepPartial<Shop>) {
        super(input);
    }

    @Column()
    name: string;

    @Index()
    @Column({ unique: true })
    code: string;

    /**
     * Optional custom domain for the shop.
     */
    @Column({ nullable: true })
    domain: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true })
    seoTitle: string;

    @Column({ nullable: true })
    seoDescription: string;

    @OneToMany(() => Channel, channel => channel.shop)
    channels: Channel[];
}
