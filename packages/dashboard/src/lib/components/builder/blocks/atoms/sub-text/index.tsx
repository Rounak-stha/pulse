import type { SubtextProps } from '@/builder-blocks/atoms/index.js';
import { DefaultSubTextProps, Subtext as SubtextPure } from '@/builder-blocks/atoms/index.js';
import { cn } from '@/vdb/lib/utils.js';
import { useNode } from '@craftjs/core';
import { SubtextSettings } from './settings.js';

export const Subtext: React.FC<SubtextProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <SubtextPure
            {...props}
            ref={(ref: HTMLParagraphElement) => {
                connect(drag(ref));
            }}
            className={cn({
                'hover:outline hover:outline-blue-500 hover:outline-dotted': !selected,
                'ring-2 ring-blue-500 ring-inset': selected,
            })}
        />
    );
};

(Subtext as any).craft = {
    displayName: 'Subtext',
    props: DefaultSubTextProps,
    related: { settings: SubtextSettings },
};
