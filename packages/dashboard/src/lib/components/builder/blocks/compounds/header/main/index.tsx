import { useNode } from '@craftjs/core';

import { DefaultHeaderProps, HeaderProps, Header as HeaderPure } from '@/builder-blocks/compounds/index.js';

import { HeaderSettings } from './settings.js';

export const Header: React.FC<HeaderProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <HeaderPure
            {...props}
            ref={(ref: HTMLHeadingElement) => {
                connect(drag(ref));
            }}
            selected={selected}
        />
    );
};

(Header as any).craft = {
    displayName: 'Header',
    props: DefaultHeaderProps,
    related: { settings: HeaderSettings },
};
