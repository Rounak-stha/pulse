import { Product } from '../page/types.js';

export interface ProductGalleryProps {
    product: Product;
    className?: string;
    images: Array<{
        id: string;
        source: string;
        preview: string;
    }>;
    selectedImageIndex: number;
    layout: 'grid' | 'carousel' | 'stacked';
    thumbnailPosition: 'top' | 'left' | 'bottom' | 'right';
    zoom: boolean;
    aspectRatio: '1:1' | '4:3' | '16:9';
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
