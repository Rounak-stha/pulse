import type { ProductGalleryProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultProductGalleryProps,
    ProductGallery as ProductGalleryPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ProductGallerySettings } from './settings.js';

export const ProductGallery: React.FC<ProductGalleryProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ProductGalleryPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(ProductGallery as any).craft = {
    displayName: 'ProductGalery',
    props: DefaultProductGalleryProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ProductGallerySettings,
    },
};
