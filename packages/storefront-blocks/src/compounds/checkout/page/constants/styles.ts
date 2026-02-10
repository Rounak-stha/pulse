export const containerSizeClasses = {
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
};

export const spacingClasses = {
    compact: 'px-4 py-6',
    normal: 'px-4 py-8 md:px-6 md:py-12',
    comfortable: 'px-6 py-12 md:px-8 md:py-16',
};

export const gapClasses = {
    compact: 'gap-6',
    normal: 'gap-8',
    comfortable: 'gap-10',
};

export const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
};

export const borderClasses = {
    none: '',
    subtle: 'border border-border rounded-xl',
    bold: 'border-2 border-border rounded-2xl shadow-sm',
};

export const stepLabels: Record<import('../types.js').CheckoutStep, string> = {
    ORDER_SUMMARY: 'Cart',
    CUSTOMER_INFO: 'Details',
    SHIPPING_ADDRESS: 'Address',
    SHIPPING_METHOD: 'Shipping',
    PAYMENT: 'Payment',
    CONFIRMATION: 'Done',
};

export const stepOrder: import('../types.js').CheckoutStep[] = [
    'ORDER_SUMMARY',
    'CUSTOMER_INFO',
    'SHIPPING_ADDRESS',
    'SHIPPING_METHOD',
    'PAYMENT',
    'CONFIRMATION',
];
