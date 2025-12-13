import type { BadgeProps } from '@/builder-blocks/atoms/index.js';
import { Badge as BadgePure, DeafultBadgeProps } from '@/builder-blocks/atoms/index.js';
import { cn } from '@/vdb/lib/utils.js';
import { useNode } from '@craftjs/core';
import { BadgeSettings } from './settings.js';

export const Badge: React.FC<BadgeProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <BadgePure
            {...props}
            ref={(ref: HTMLSpanElement) => {
                connect(drag(ref));
            }}
            className={cn({
                'hover:outline hover:outline-blue-500 hover:outline-dotted': !selected,
                'ring-2 ring-blue-500 ring-offset-2': selected,
            })}
        />
    );
};

(Badge as any).craft = {
    displayName: 'Badge',
    props: DeafultBadgeProps,
    related: { settings: BadgeSettings },
};
