import { ProductGridProps } from '../types.js';

export const DefaultProductGridProps: ProductGridProps = {
    products: [],
    view: 'grid',
    columns: 3,
    gap: 'normal',
    cardStyle: 'standard',
    imageAspectRatio: '1:1',
    showDescription: false,
    showPrice: true,
};
