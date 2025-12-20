import type { ButtonProps } from '@/builder-blocks/atoms/index.js';
import { Button as ButtonPure, DefaultButtonProps } from '@/builder-blocks/atoms/index.js';
import { cn } from '@/vdb/lib/utils.js';
import { useNode } from '@craftjs/core';
import { ButtonSettings } from './settings.js';

export const Button: React.FC<ButtonProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ButtonPure
            {...props}
            ref={(ref: HTMLButtonElement) => {
                connect(drag(ref));
            }}
            className={cn({
                'hover:outline hover:outline-blue-500 hover:outline-dotted': !selected,
                'ring-2 ring-blue-500 ring-inset': selected,
            })}
        />
    );
};

(Button as any).craft = {
    displayName: 'Badge',
    props: DefaultButtonProps,
    related: { settings: ButtonSettings },
};
