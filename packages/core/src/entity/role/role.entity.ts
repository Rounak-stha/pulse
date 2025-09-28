import { Permission } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { ChannelAware, ShopAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { Shop } from '../shop/shop.entity';

/**
 * @description
 * A Role represents a collection of permissions which determine the authorization
 * level of a {@link User} on a given set of {@link Channel}s.
 *
 * @docsCategory entities
 */
@Entity()
export class Role extends VendureEntity implements ChannelAware, ShopAware {
    constructor(input?: DeepPartial<Role>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop)
    shop: Shop;

    @Column() code: string;

    @Column() description: string;

    @Column('simple-array') permissions: Permission[];

    @ManyToMany(type => Channel, channel => channel.roles)
    @JoinTable()
    channels: Channel[];
}
