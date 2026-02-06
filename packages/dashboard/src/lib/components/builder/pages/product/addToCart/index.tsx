import type { AddToCartProps } from '@/builder-blocks/compounds/index.js';
import { AddToCart as AddToCartPure, DefaultAddToCartProps } from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { AddToCartSettings } from './settings.js';

export const AddToCart: React.FC<AddToCartProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <AddToCartPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(AddToCart as any).craft = {
    displayName: 'AddToCart',
    props: DefaultAddToCartProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: AddToCartSettings,
    },
};
