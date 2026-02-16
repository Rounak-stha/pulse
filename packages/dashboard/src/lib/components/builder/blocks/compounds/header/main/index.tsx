import { useNode } from '@craftjs/core';
import { useQuery } from '@tanstack/react-query';

import { DefaultHeaderProps, HeaderProps, Header as HeaderPure } from '@/builder-blocks/compounds/index.js';
import { getActiveShopQuery } from '@/vdb/components/builder/builder.graphql.js';
import { api } from '@/vdb/graphql/api.js';

import { HeaderSettings } from './settings.js';

export const Header: React.FC<HeaderProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    const { data } = useQuery({
        queryKey: ['active-shop'],
        queryFn: () => api.query(getActiveShopQuery),
    });

    const shop = data?.activeShop;

    return (
        <HeaderPure
            {...props}
            ref={(ref: HTMLHeadingElement) => {
                connect(drag(ref));
            }}
            selected={selected}
            logoText={shop?.name || props.logoText}
            logoImage={shop?.logo || props.logoImage}
        />
    );
};

(Header as any).craft = {
    displayName: 'Header',
    props: DefaultHeaderProps,
    related: { settings: HeaderSettings },
    custom: {
        isGlobal: true,
    },
};
