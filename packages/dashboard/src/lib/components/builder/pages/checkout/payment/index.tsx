import type { PaymentProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultPaymentProps,
    Payment as PaymentPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { PaymentSettings } from './settings.js';

export const Payment: React.FC<PaymentProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <PaymentPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(Payment as any).craft = {
    displayName: 'Payment',
    props: DefaultPaymentProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: PaymentSettings,
    },
};
