'use client';
import { activeOrderQuery } from '@/lib/queries/checkout';
import { useQuery } from '@apollo/client/react';
import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import {
    CheckoutPage,
    Confirmation,
    DefaultCheckoutPageProps,
    DefaultConfirmationProps,
    DefaultCustomerInfoProps,
    DefaultOrderSummaryProps,
    DefaultPaymentProps,
    DefaultShippingAddressProps,
    DefaultShippingMethodProps,
} from '@vendure/storefront-blocks/compounds';
import type { CheckoutOrder, CheckoutStep } from '@vendure/storefront-blocks/types';
import { useCallback, useState } from 'react';
import { CustomerInfo } from './customer-info';
import { OrderSummary } from './order-summary';
import { Payment } from './payment';
import { ShippingAddress } from './shipping-address';
import { ShippingMethod } from './shipping-method';

interface CheckoutPageRendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
    shopcode: string;
}

const STEP_SEQUENCE: CheckoutStep[] = [
    'ORDER_SUMMARY',
    'CUSTOMER_INFO',
    'SHIPPING_ADDRESS',
    'SHIPPING_METHOD',
    'PAYMENT',
    'CONFIRMATION',
];

export function CheckoutPageRenderer({ node, tree, shopcode }: CheckoutPageRendererProps) {
    const [step, setStep] = useState<CheckoutStep>('ORDER_SUMMARY');
    const [completedOrderCode, setCompletedOrderCode] = useState<string>();
    const { data, refetch } = useQuery(activeOrderQuery, {
        context: { headers: { shopcode } },
    });

    const activeOrder = data?.activeOrder;

    const order: CheckoutOrder | null = activeOrder
        ? {
              id: activeOrder.id,
              code: activeOrder.code,
              state: activeOrder.state,
              currencyCode: activeOrder.currencyCode,
              totalQuantity: activeOrder.totalQuantity,
              subTotalWithTax: activeOrder.subTotalWithTax,
              shippingWithTax: activeOrder.shippingWithTax,
              totalWithTax: activeOrder.totalWithTax,
              couponCodes: activeOrder.couponCodes,
              lines: activeOrder.lines,
              shippingLines: activeOrder.shippingLines,
              discounts: activeOrder.discounts,
          }
        : null;

    const goToNext = useCallback(() => {
        const idx = STEP_SEQUENCE.indexOf(step);
        if (idx < STEP_SEQUENCE.length - 1) {
            setStep(STEP_SEQUENCE[idx + 1]);
            refetch();
        }
    }, [step, refetch]);

    const goToPrev = useCallback(() => {
        const idx = STEP_SEQUENCE.indexOf(step);
        if (idx > 0) setStep(STEP_SEQUENCE[idx - 1]);
    }, [step]);

    const handleOrderComplete = useCallback((orderCode: string) => {
        setCompletedOrderCode(orderCode);
        setStep('CONFIRMATION');
    }, []);

    const props = node.props;

    return (
        <CheckoutPage
            {...DefaultCheckoutPageProps}
            {...props}
            step={step}
            onStepChange={setStep}
            order={order}
            OrderSummarySlot={
                <OrderSummary
                    {...DefaultOrderSummaryProps}
                    shopcode={shopcode}
                    order={order}
                    currencyCode={order?.currencyCode ?? 'USD'}
                    compact={step !== 'ORDER_SUMMARY'}
                    onGoNext={goToNext}
                />
            }
            CustomerInfoSlot={
                <CustomerInfo
                    {...DefaultCustomerInfoProps}
                    shopcode={shopcode}
                    onGoBack={goToPrev}
                    onStepComplete={goToNext}
                    value={{
                        emailAddress: activeOrder?.customer?.emailAddress,
                        firstName: activeOrder?.customer?.firstName,
                        lastName: activeOrder?.customer?.lastName,
                    }}
                />
            }
            ShippingAddressSlot={
                <ShippingAddress
                    {...DefaultShippingAddressProps}
                    shopcode={shopcode}
                    onGoBack={goToPrev}
                    onStepComplete={goToNext}
                    value={{
                        city: activeOrder?.shippingAddress?.city,
                        company: activeOrder?.shippingAddress?.company,
                        streetLine1: activeOrder?.shippingAddress?.streetLine1,
                        streetLine2: activeOrder?.shippingAddress?.streetLine2,
                        postalCode: activeOrder?.shippingAddress?.postalCode,
                        province: activeOrder?.shippingAddress?.province,
                        fullName: activeOrder?.shippingAddress?.fullName,
                        phoneNumber: activeOrder?.shippingAddress?.phoneNumber,
                    }}
                />
            }
            ShippingMethodSlot={
                <ShippingMethod
                    {...DefaultShippingMethodProps}
                    shopcode={shopcode}
                    currencyCode={order?.currencyCode ?? 'USD'}
                    onGoBack={goToPrev}
                    onStepComplete={goToNext}
                />
            }
            PaymentSlot={
                <Payment
                    {...DefaultPaymentProps}
                    shopcode={shopcode}
                    onGoBack={goToPrev}
                    onOrderComplete={handleOrderComplete}
                />
            }
            ConfirmationSlot={
                <Confirmation
                    {...DefaultConfirmationProps}
                    order={order}
                    orderCode={completedOrderCode}
                    currencyCode={order?.currencyCode ?? 'USD'}
                />
            }
        />
    );
}
