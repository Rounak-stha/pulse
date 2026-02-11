import type { ShopPaginationProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultShopPaginationProps,
    ShopPagination as ShopPaginationPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ShopPaginationSettings } from './settings.js';

export const ShopPagination: React.FC<ShopPaginationProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ShopPaginationPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            {...props}
        />
    );
};

(ShopPagination as any).craft = {
    displayName: 'Shop Pagination',
    props: DefaultShopPaginationProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShopPaginationSettings,
    },
};
