import { ReactNode } from 'react';

export type CheckoutStep =
    | 'ORDER_SUMMARY'
    | 'CUSTOMER_INFO'
    | 'SHIPPING_ADDRESS'
    | 'SHIPPING_METHOD'
    | 'PAYMENT'
    | 'CONFIRMATION';

export interface CheckoutOrderLine {
    id: string;
    quantity: number;
    linePriceWithTax: number;
    unitPriceWithTax: number;
    productVariant: { id: string; name: string; sku: string };
    featuredAsset: { id: string; preview: string } | null;
}

export interface CheckoutOrder {
    id: string;
    code: string;
    state: string;
    currencyCode: string;
    totalQuantity: number;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    couponCodes: string[];
    lines: CheckoutOrderLine[];
    shippingLines: {
        shippingMethod: { description: string };
        priceWithTax: number;
    }[];
    discounts: {
        description: string;
        amountWithTax: number;
    }[];
}

export interface ShippingMethodOption {
    id: string;
    name: string;
    description: string;
    priceWithTax: number;
    currencyCode: string;
}

export interface PaymentMethodOption {
    id: string;
    name: string;
    description: string;
    code: string;
}

export interface AddressInput {
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode: string;
    countryCode: string;
    phoneNumber?: string;
}

export interface CheckoutPageBaseProps {
    layout: 'single-column' | 'with-sidebar';
    spacing: 'compact' | 'normal' | 'comfortable';
    containerSize: 'default' | 'wide' | 'full';
    backgroundColor: 'default' | 'muted';
    borderStyle: 'none' | 'subtle' | 'bold';

    step: CheckoutStep;
    onStepChange?: (step: CheckoutStep) => void;

    OrderSummarySlot?: ReactNode;
    CustomerInfoSlot?: ReactNode;
    ShippingAddressSlot?: ReactNode;
    ShippingMethodSlot?: ReactNode;
    PaymentSlot?: ReactNode;
    ConfirmationSlot?: ReactNode;

    SlotFlexibleZone?: ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}

export interface CheckoutPageRuntimeProps extends CheckoutPageBaseProps {
    order: CheckoutOrder | null;
}

export interface CheckoutPageBuilderProps extends CheckoutPageBaseProps {}
