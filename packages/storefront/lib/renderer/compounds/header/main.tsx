'use client';
import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { DefaultHeaderProps, Header } from '@vendure/storefront-blocks/compounds';
import { useCart } from '@/app/providers/cart';

interface RendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
}

export function HeaderRenderer({ node }: RendererProps) {
    const props = node.props;
    const { totalQuantity, toggleDrawer } = useCart();

    return (
        <Header
            {...DefaultHeaderProps}
            {...props}
            cartItemCount={totalQuantity}
            onCartClick={toggleDrawer}
        />
    );
}
