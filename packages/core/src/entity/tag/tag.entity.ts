import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { ShopAware } from '../../common';
import { VendureEntity } from '../base/base.entity';
import { Shop } from '../shop/shop.entity';

/**
 * @description
 * A tag is an arbitrary label which can be applied to certain entities.
 * It is used to help organize and filter those entities.
 *
 * @docsCategory entities
 */
@Entity()
export class Tag extends VendureEntity implements ShopAware {
    constructor(input?: DeepPartial<Tag>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop)
    shop: Shop;

    @Column()
    value: string;
}
