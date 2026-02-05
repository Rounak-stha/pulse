import { ProductPageRuntimeProps } from '../types.js';

export const DefaultProductPageProps: ProductPageRuntimeProps = {
    backgroundColor: 'default',
    borderStyle: 'subtle',
    containerSize: 'default',
    contentAlignment: 'start',
    galleryPosition: 'left',
    layout: 'default',
    spacing: 'comfortable',
    stickyGallery: true,
    product: {
        id: '',
        name: 'Sample Product',
        slug: 'sample-product',
        description: 'Product description',
        assets: [],
        featuredAsset: {
            id: '123',
            preview: '',
            source: '',
        },
        variants: [
            {
                id: '',
                name: 'Default',
                sku: 'SKU-001',
                price: 9999,
                currencyCode: 'USD',
                stockLevel: 'IN_STOCK',
                assets: [],
                featuredAsset: null,
            },
        ],
    },
};
