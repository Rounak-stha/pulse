import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { ShopAware } from '../../common';
import { VendureEntity } from '../base/base.entity';
import { Shop } from '../shop/shop.entity';

@Entity()
@Unique('UQ_shop_builder_global_region', ['shop', 'region'])
export class BuilderGlobal extends VendureEntity implements ShopAware {
    constructor(input?: DeepPartial<BuilderGlobal>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop, { onDelete: 'CASCADE' })
    shop: Shop;

    @Column()
    region: string;

    @Column('text', { default: '' })
    content: string;

    @Column('text', { default: '' })
    draftContent: string;
}
