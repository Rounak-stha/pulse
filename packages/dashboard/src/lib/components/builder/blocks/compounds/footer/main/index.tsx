import { useNode } from '@craftjs/core';
import { useQuery } from '@tanstack/react-query';

import { DefaultFooterProps, FooterProps, Footer as FooterPure } from '@/builder-blocks/compounds/index.js';
import { getActiveShopQuery } from '@/vdb/components/builder/builder.graphql.js';
import { api } from '@/vdb/graphql/api.js';

import { FooterSettings } from './settings.js';

export const Footer: React.FC<FooterProps> = props => {
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
        <FooterPure
            {...props}
            ref={(ref: HTMLElement) => {
                connect(drag(ref));
            }}
            selected={selected}
            logoText={shop?.name || props.logoText}
            logoImage={shop?.logo || props.logoImage}
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
