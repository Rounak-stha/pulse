import { Headline as HeadlinePure } from '@/builder-blocks/atoms/headline/index.js';
import type { HeadlineProps } from '@/builder-blocks/atoms/headline/types.js';
import { useNode } from '@craftjs/core';

import { cn } from '@/vdb/lib/utils.js';
import { HeadlineSettings } from './settings.js';

export const Headline: React.FC<HeadlineProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <HeadlinePure
            {...props}
            ref={(ref: HTMLHeadingElement) => {
                connect(drag(ref));
            }}
            className={cn({
                'hover:outline hover:outline-blue-500 hover:outline-dotted': !selected,
                'ring-2 ring-blue-500 ring-inset': selected,
            })}
        />
    );
};

(Headline as any).craft = {
    displayName: 'Headline',
    props: {
        // Background
        backgroundType: 'gradient',
        backgroundImage: '',
        backgroundVideo: '',
        backgroundColor: '#f9fafb',
        gradientFrom: '#eff6ff',
        gradientTo: '#fef3c7',
        gradientDirection: 'to-bottom',
        overlayEnabled: false,
        overlayColor: '#000000',
        overlayOpacity: 40,

        // Layout
        layout: 'centered',
        size: 'normal',
        contentWidth: 'medium',
        verticalAlign: 'center',

        // Content visibility
        showBadge: true,
        showHeadline: true,
        showSubtext: true,
        showCTA: true,

        // Styling
        theme: 'auto',
        contentSpacing: 'normal',
        rounded: false,
        shadow: false,

        // Animation
        parallax: false,
        animateContent: false,
    },
    related: { settings: HeadlineSettings },
};
