import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { ShopAware, SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomAdministratorFields } from '../custom-entity-fields';
import { Shop } from '../shop/shop.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * An administrative user who has access to the Admin UI and Admin API. The
 * specific permissions of the Administrator are determined by the assigned
 * {@link Role}s.
 *
 * @docsCategory entities
 */
@Entity()
export class Administrator extends VendureEntity implements SoftDeletable, HasCustomFields, ShopAware {
    constructor(input?: DeepPartial<Administrator>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Shop, { onDelete: 'CASCADE' })
    shop: Shop;

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @Column(type => CustomAdministratorFields)
    customFields: CustomAdministratorFields;
}
