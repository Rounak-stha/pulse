import type { OrderSummaryProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultOrderSummaryProps,
    OrderSummary as OrderSummaryPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { OrderSummarySettings } from './settings.js';

export const OrderSummary: React.FC<OrderSummaryProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <OrderSummaryPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(OrderSummary as any).craft = {
    displayName: 'OrderSummary',
    props: DefaultOrderSummaryProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: OrderSummarySettings,
    },
};
