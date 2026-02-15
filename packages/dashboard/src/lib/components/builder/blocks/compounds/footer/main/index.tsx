import { useNode } from '@craftjs/core';

import { DefaultFooterProps, FooterProps, Footer as FooterPure } from '@/builder-blocks/compounds/index.js';

import { FooterSettings } from './settings.js';

export const Footer: React.FC<FooterProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <FooterPure
            {...props}
            ref={(ref: HTMLElement) => {
                connect(drag(ref));
            }}
            selected={selected}
        />
    );
};

(Footer as any).craft = {
    displayName: 'Footer',
    props: DefaultFooterProps,
    related: { settings: FooterSettings },
    custom: {
        isGlobal: true,
    },
};
