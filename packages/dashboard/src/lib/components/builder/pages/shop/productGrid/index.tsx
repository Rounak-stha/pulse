import type { ProductGridProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultProductGridProps,
    ProductGrid as ProductGridPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ProductGridSettings } from './settings.js';

export const ProductGrid: React.FC<ProductGridProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ProductGridPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            {...props}
        />
    );
};

(ProductGrid as any).craft = {
    displayName: 'Product Grid',
    props: DefaultProductGridProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ProductGridSettings,
    },
};
