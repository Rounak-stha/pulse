import type { ConfirmationProps } from '@/builder-blocks/compounds/index.js';
import {
    Confirmation as ConfirmationPure,
    DefaultConfirmationProps,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ConfirmationSettings } from './settings.js';

export const Confirmation: React.FC<ConfirmationProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ConfirmationPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            className={selected ? 'ring-2 ring-blue-500 ring-inset' : ''}
            {...props}
        />
    );
};

(Confirmation as any).craft = {
    displayName: 'Confirmation',
    props: DefaultConfirmationProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ConfirmationSettings,
    },
};
