import type { CheckoutPreviewData } from '@/builder-blocks/compounds/checkout/context.js';
import type { CheckoutStep } from '@/builder-blocks/compounds/checkout/page/types.js';
import type { CheckoutPageBuilderProps } from '@/builder-blocks/compounds/index.js';
import {
    CheckoutPage as CheckoutPagePure,
    CheckoutPreviewProvider,
    DefaultCheckoutPageProps,
    DefaultConfirmationProps,
    DefaultCustomerInfoProps,
    DefaultOrderSummaryProps,
    DefaultPaymentProps,
    DefaultShippingAddressProps,
    DefaultShippingMethodProps,
} from '@/builder-blocks/compounds/index.js';
import { Element, useNode } from '@craftjs/core';
import { useMemo, useState } from 'react';
import { Confirmation } from './confirmation/index.js';
import { CustomerInfo } from './customerInfo/index.js';
import { MOCK_CHECKOUT_ORDER } from './mock-data.js';
import { OrderSummary } from './orderSummary/index.js';
import { Payment } from './payment/index.js';
import { CheckoutPageSettings } from './settings.js';
import { ShippingAddress } from './shippingAddress/index.js';
import { ShippingMethod } from './shippingMethod/index.js';

export const CheckoutPage: React.FC<CheckoutPageBuilderProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    const { ...runtimeProps } = props;
    const [step, setStep] = useState<CheckoutStep>('ORDER_SUMMARY');

    const previewData = useMemo<CheckoutPreviewData>(() => ({ order: MOCK_CHECKOUT_ORDER, step }), [step]);

    const handleStepChange = (newStep: CheckoutStep) => setStep(newStep);

    return (
        <CheckoutPreviewProvider value={previewData}>
            <CheckoutPagePure
                onStepChange={handleStepChange}
                OrderSummarySlot={
                    <Element
                        id="OrderSummary"
                        is={OrderSummary}
                        {...DefaultOrderSummaryProps}
                        order={MOCK_CHECKOUT_ORDER}
                    />
                }
                CustomerInfoSlot={
                    <Element id="CustomerInfo" is={CustomerInfo} {...DefaultCustomerInfoProps} />
                }
                ShippingAddressSlot={
                    <Element id="ShippingAddress" is={ShippingAddress} {...DefaultShippingAddressProps} />
                }
                ShippingMethodSlot={
                    <Element id="ShippingMethod" is={ShippingMethod} {...DefaultShippingMethodProps} />
                }
                PaymentSlot={<Element id="Payment" is={Payment} {...DefaultPaymentProps} />}
                ConfirmationSlot={
                    <Element
                        id="Confirmation"
                        is={Confirmation}
                        {...DefaultConfirmationProps}
                        order={MOCK_CHECKOUT_ORDER}
                    />
                }
                SlotFlexibleZone={
                    <Element
                        id="flexible-zone"
                        is="div"
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]"
                        canvas
                    >
                        <p className="text-gray-400 text-center">
                            Add sections here (Trust badges, FAQ, etc.)
                        </p>
                    </Element>
                }
                {...runtimeProps}
                order={MOCK_CHECKOUT_ORDER}
                step={step}
                ref={(ref: HTMLDivElement) => {
                    connect(ref);
                }}
                selected={selected}
            />
        </CheckoutPreviewProvider>
    );
};

(CheckoutPage as any).craft = {
    displayName: 'Checkout Page',
    props: DefaultCheckoutPageProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: CheckoutPageSettings,
    },
};
