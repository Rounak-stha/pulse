import { Column, DeepPartial, Entity, JoinColumn, OneToOne } from 'typeorm';

import { ShopAware } from '../../common';
import { VendureEntity } from '../base/base.entity';
import { Shop } from '../shop/shop.entity';

@Entity()
export class Theme extends VendureEntity implements ShopAware {
    constructor(input?: DeepPartial<Theme>) {
        super(input);
    }

    @OneToOne(type => Shop, { onDelete: 'CASCADE' })
    @JoinColumn()
    shop: Shop;

    @Column('simple-json')
    value: Record<string, any>; // live theme
}
