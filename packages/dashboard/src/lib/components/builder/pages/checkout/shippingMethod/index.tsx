import type { ShippingMethodProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultShippingMethodProps,
    ShippingMethod as ShippingMethodPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ShippingMethodSettings } from './settings.js';

export const ShippingMethod: React.FC<ShippingMethodProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ShippingMethodPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(ShippingMethod as any).craft = {
    displayName: 'ShippingMethod',
    props: DefaultShippingMethodProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShippingMethodSettings,
    },
};
