import type { CheckoutOrder } from '@/builder-blocks/compounds/checkout/page/types.js';

export const MOCK_CHECKOUT_ORDER: CheckoutOrder = {
    id: 'preview-order',
    code: 'PREVIEW-001',
    state: 'AddingItems',
    currencyCode: 'USD',
    totalQuantity: 3,
    subTotalWithTax: 12500,
    shippingWithTax: 999,
    totalWithTax: 13499,
    couponCodes: ['SAVE10'],
    lines: [
        {
            id: 'line-1',
            quantity: 2,
            unitPriceWithTax: 2999,
            linePriceWithTax: 5998,
            productVariant: { id: 'v1', name: 'Classic T-Shirt (Black / M)', sku: 'TSH-BLK-M' },
            featuredAsset: {
                id: 'a1',
                preview: 'https://placehold.co/200x200/1a1a2e/ffffff?text=T-Shirt',
            },
        },
        {
            id: 'line-2',
            quantity: 1,
            unitPriceWithTax: 6502,
            linePriceWithTax: 6502,
            productVariant: { id: 'v2', name: 'Running Shoes (White / 10)', sku: 'SHO-WHT-10' },
            featuredAsset: {
                id: 'a2',
                preview: 'https://placehold.co/200x200/2d3436/ffffff?text=Shoes',
            },
        },
    ],
    shippingLines: [
        {
            shippingMethod: { description: 'Standard Shipping' },
            priceWithTax: 999,
        },
    ],
    discounts: [],
};

export const MOCK_SHIPPING_METHODS = [
    {
        id: 'sm-1',
        name: 'Standard Shipping',
        description: '5-7 business days',
        priceWithTax: 999,
        currencyCode: 'USD',
    },
    {
        id: 'sm-2',
        name: 'Express Shipping',
        description: '2-3 business days',
        priceWithTax: 1999,
        currencyCode: 'USD',
    },
    {
        id: 'sm-3',
        name: 'Free Shipping',
        description: '7-10 business days (orders over $50)',
        priceWithTax: 0,
        currencyCode: 'USD',
    },
];

export const MOCK_PAYMENT_METHODS = [
    {
        id: 'pm-1',
        name: 'Credit Card',
        description: 'Visa, Mastercard, Amex',
        code: 'credit-card',
    },
    { id: 'pm-2', name: 'PayPal', description: 'Pay with PayPal', code: 'paypal' },
];

export const MOCK_COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'AU', name: 'Australia' },
    { code: 'NP', name: 'Nepal' },
];
