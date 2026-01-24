import { AddToCartProps } from '../types.js';

export const DefaultAddToCartProps: AddToCartProps = {
    showQuantitySelector: true,
    showWishlist: true,
    showCompare: false,
    buttonSize: 'large',
    buttonStyle: 'solid',
    variant: {
        id: '',
        currencyCode: 'NPR',
        price: 0,
        stockLevel: 'IN_STOCK',
        name: 'Variant Name',
        sku: 'Variant SKU',
    },
};
