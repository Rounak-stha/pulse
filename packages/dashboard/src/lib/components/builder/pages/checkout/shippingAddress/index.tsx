import type { ShippingAddressProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultShippingAddressProps,
    ShippingAddress as ShippingAddressPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ShippingAddressSettings } from './settings.js';

export const ShippingAddress: React.FC<ShippingAddressProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ShippingAddressPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(ShippingAddress as any).craft = {
    displayName: 'ShippingAddress',
    props: DefaultShippingAddressProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShippingAddressSettings,
    },
};
