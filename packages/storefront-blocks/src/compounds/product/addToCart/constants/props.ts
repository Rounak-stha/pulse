import { Product } from '../../page/types.js';
import { AddToCartProps } from '../types.js';

export const DefaultAddToCartProps: AddToCartProps = {
    showQuantitySelector: true,
    showWishlist: true,
    showCompare: false,
    buttonSize: 'large',
    buttonStyle: 'solid',
    product: {} as Product,
    variant: {
        id: '',
        currencyCode: 'NPR',
        price: 0,
        priceWithTax: 0,
        stockLevel: 'IN_STOCK',
        name: 'Variant Name',
        sku: 'Variant SKU',
        featuredAsset: null,
        assets: [],
    },
};
