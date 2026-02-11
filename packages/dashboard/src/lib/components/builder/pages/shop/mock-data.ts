import type { FacetGroup, ShopProduct } from '@/builder-blocks/compounds/index.js';

export const mockShopProducts: ShopProduct[] = [
    {
        productId: '1',
        productName: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-t-shirt',
        description: 'A comfortable everyday essential made from 100% organic cotton.',
        image: null,
        price: { type: 'single', value: 2999 },
        currencyCode: 'USD',
    },
    {
        productId: '2',
        productName: 'Slim Fit Denim Jeans',
        slug: 'slim-fit-denim-jeans',
        description: 'Modern slim fit jeans with stretch comfort.',
        image: null,
        price: { type: 'range', min: 5999, max: 7999 },
        currencyCode: 'USD',
    },
    {
        productId: '3',
        productName: 'Leather Crossbody Bag',
        slug: 'leather-crossbody-bag',
        description: 'Handcrafted genuine leather bag with adjustable strap.',
        image: null,
        price: { type: 'single', value: 12999 },
        currencyCode: 'USD',
    },
    {
        productId: '4',
        productName: 'Running Sneakers',
        slug: 'running-sneakers',
        description: 'Lightweight performance shoes with cushioned sole.',
        image: null,
        price: { type: 'single', value: 8999 },
        currencyCode: 'USD',
    },
    {
        productId: '5',
        productName: 'Wool Blend Sweater',
        slug: 'wool-blend-sweater',
        image: null,
        price: { type: 'single', value: 6499 },
        currencyCode: 'USD',
    },
    {
        productId: '6',
        productName: 'Canvas Tote Bag',
        slug: 'canvas-tote-bag',
        image: null,
        price: { type: 'single', value: 3499 },
        currencyCode: 'USD',
    },
];

export const mockFacetGroups: FacetGroup[] = [
    {
        id: 'category',
        name: 'Category',
        values: [
            { id: 'cat-1', name: 'Clothing', count: 24 },
            { id: 'cat-2', name: 'Accessories', count: 12 },
            { id: 'cat-3', name: 'Footwear', count: 8 },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        values: [
            { id: 'size-s', name: 'S', count: 15 },
            { id: 'size-m', name: 'M', count: 20 },
            { id: 'size-l', name: 'L', count: 18 },
            { id: 'size-xl', name: 'XL', count: 10 },
        ],
    },
    {
        id: 'color',
        name: 'Color',
        values: [
            { id: 'color-black', name: 'Black', count: 22 },
            { id: 'color-white', name: 'White', count: 16 },
            { id: 'color-blue', name: 'Blue', count: 11 },
        ],
    },
];
