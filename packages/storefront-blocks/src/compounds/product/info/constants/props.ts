import { ProductInfoProps } from '../types.js';

export const DefaultProductInfoProps: ProductInfoProps = {
    showSKU: true,
    showStock: true,
    priceSize: 'large',
    product: {} as ProductInfoProps['product'],
    selectedVariant: { id: 'DemoId', sku: 'DemoSku', stockLevel: 'IN_STOCK', currencyCode: 'NPR', price: 100, name: 'DemoName' } as ProductInfoProps['selectedVariant'],
};
