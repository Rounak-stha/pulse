import { ProductInfoProps } from '../types.js';

export const DefaultProductInfoProps: ProductInfoProps = {
    showSKU: true,
    showStock: true,
    priceSize: 'large',
    product: {
        id: '',
        assets: [],
        description: '',
        name: '',
        slug: '',
        variants: [],
        featuredAsset: null,
    },
    selectedVariant: {
        id: 'DemoId',
        sku: 'DemoSku',
        stockLevel: 'IN_STOCK',
        currencyCode: 'NPR',
        price: 100,
        name: 'DemoName',
        assets: [],
        featuredAsset: null,
    },
};
