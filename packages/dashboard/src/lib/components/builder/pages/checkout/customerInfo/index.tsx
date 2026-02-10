import type { CustomerInfoProps } from '@/builder-blocks/compounds/index.js';
import {
    CustomerInfo as CustomerInfoPure,
    DefaultCustomerInfoProps,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { CustomerInfoSettings } from './settings.js';

export const CustomerInfo: React.FC<CustomerInfoProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <CustomerInfoPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(CustomerInfo as any).craft = {
    displayName: 'CustomerInfo',
    props: DefaultCustomerInfoProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: CustomerInfoSettings,
    },
};
