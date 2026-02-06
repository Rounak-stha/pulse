import type { ProductInfoProps } from '@/builder-blocks/compounds/index.js';
import { DefaultProductInfoProps, ProductInfo as ProductInfoPure } from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ProductInfoSettings } from './settings.js';

export const ProductInfo: React.FC<ProductInfoProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ProductInfoPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(ProductInfo as any).craft = {
    displayName: 'ProductInfo',
    props: DefaultProductInfoProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ProductInfoSettings,
    },
};
