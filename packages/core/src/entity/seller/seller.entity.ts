import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Channel } from '..';
import { ShopAware, SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomSellerFields } from '../custom-entity-fields';
import { Shop } from '../shop/shop.entity';

/**
 * @description
 * A Seller represents the person or organization who is selling the goods on a given {@link Channel}.
 * By default, a single-channel Vendure installation will have a single default Seller.
 *
 * @docsCategory entities
 */
@Entity()
export class Seller extends VendureEntity implements SoftDeletable, HasCustomFields, ShopAware {
    constructor(input?: DeepPartial<Seller>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop, { onDelete: 'CASCADE' })
    shop: Shop;

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() name: string;

    @Column(type => CustomSellerFields)
    customFields: CustomSellerFields;

    @OneToMany(type => Channel, channel => channel.seller)
    channels: Channel[];
}
