export interface ProductGalleryProps {
    className?: string;
    images: Array<{
        id: string;
        source: string;
        preview: string;
    }>;
    layout: 'grid' | 'carousel' | 'stacked';
    thumbnailPosition: 'top' | 'left' | 'bottom' | 'right';
    zoom: boolean;
    aspectRatio: '1:1' | '4:3' | '16:9';
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
