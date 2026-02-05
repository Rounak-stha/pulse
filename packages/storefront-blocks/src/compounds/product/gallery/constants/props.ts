import { Product } from '../../index.js';
import { ProductGalleryProps } from '../types.js';

export const DefaultProductGalleryProps: ProductGalleryProps = {
    product: {} as Product,
    images: [],
    layout: 'grid',
    selectedImageIndex: 0,
    thumbnailPosition: 'bottom',
    zoom: true,
    aspectRatio: '1:1',
};
