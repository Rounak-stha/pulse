import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { ShopAware } from '../../common';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { FulfillmentState } from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { VendureEntity } from '../base/base.entity';
import { CustomFulfillmentFields } from '../custom-entity-fields';
import { FulfillmentLine } from '../order-line-reference/fulfillment-line.entity';
import { Order } from '../order/order.entity';
import { Shop } from '../shop/shop.entity';

/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. which {@link OrderLine}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
@Entity()
export class Fulfillment extends VendureEntity implements HasCustomFields, ShopAware {
    constructor(input?: DeepPartial<Fulfillment>) {
        super(input);
    }
    /**
     * @description
     * The shop the fulfillment belongs to
     */
    @Index()
    @ManyToOne(type => Shop)
    shop: Shop;

    @Column('varchar') state: FulfillmentState;

    @Column({ default: '' })
    trackingCode: string;

    @Column()
    method: string;

    @Column()
    handlerCode: string;

    @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment)
    lines: FulfillmentLine[];

    @ManyToMany(type => Order, order => order.fulfillments)
    orders: Order[];

    @Column(type => CustomFulfillmentFields)
    customFields: CustomFulfillmentFields;
}
