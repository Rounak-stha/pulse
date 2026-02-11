import type { ShopFiltersProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultShopFiltersProps,
    ShopFilters as ShopFiltersPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ShopFiltersSettings } from './settings.js';

export const ShopFilters: React.FC<ShopFiltersProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ShopFiltersPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            {...props}
        />
    );
};

(ShopFilters as any).craft = {
    displayName: 'Shop Filters',
    props: DefaultShopFiltersProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShopFiltersSettings,
    },
};
