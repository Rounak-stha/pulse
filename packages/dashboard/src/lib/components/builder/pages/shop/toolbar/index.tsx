import type { ShopToolbarProps } from '@/builder-blocks/compounds/index.js';
import {
    DefaultShopToolbarProps,
    ShopToolbar as ShopToolbarPure,
} from '@/builder-blocks/compounds/index.js';
import { useNode } from '@craftjs/core';
import { ShopToolbarSettings } from './settings.js';

export const ShopToolbar: React.FC<ShopToolbarProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <ShopToolbarPure
            ref={(ref: HTMLDivElement) => {
                connect(ref);
            }}
            selected={selected}
            {...props}
        />
    );
};

(ShopToolbar as any).craft = {
    displayName: 'Shop Toolbar',
    props: DefaultShopToolbarProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShopToolbarSettings,
    },
};
