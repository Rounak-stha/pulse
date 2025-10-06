import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { ChannelAware, ShopAware } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomPaymentMethodFields } from '../custom-entity-fields';
import { Shop } from '../shop/shop.entity';

import { PaymentMethodTranslation } from './payment-method-translation.entity';

/**
 * @description
 * A PaymentMethod is created automatically according to the configured {@link PaymentMethodHandler}s defined
 * in the {@link PaymentOptions} config.
 *
 * @docsCategory entities
 */
@Entity()
export class PaymentMethod
    extends VendureEntity
    implements Translatable, ChannelAware, HasCustomFields, ShopAware
{
    constructor(input?: DeepPartial<PaymentMethod>) {
        super(input);
    }

    name: LocaleString;

    @Column({ default: '' }) code: string;

    @Index()
    @ManyToOne(type => Shop, { onDelete: 'CASCADE' })
    shop: Shop;

    description: LocaleString;

    @OneToMany(type => PaymentMethodTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<PaymentMethod>>;

    @Column() enabled: boolean;

    @Column('simple-json', { nullable: true }) checker: ConfigurableOperation | null;

    @Column('simple-json') handler: ConfigurableOperation;

    @ManyToMany(type => Channel, channel => channel.paymentMethods)
    @JoinTable()
    channels: Channel[];

    @Column(type => CustomPaymentMethodFields)
    customFields: CustomPaymentMethodFields;
}
