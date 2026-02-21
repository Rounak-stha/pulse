'use client';
import { useSearchParams } from 'next/navigation';

import { useCart } from '@/app/providers/cart';
import { AddToCart as AddToCartPure } from '@vendure/storefront-blocks/compounds';
import type { AddToCartProps as AddToCartPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';

type AddToCartProps = AddToCartPropsPure & {
    shopcode: string;
};

export const AddToCart: FC<AddToCartProps> = props => {
    return <AddToCartInner {...props} />;
};

const AddToCartInner: FC<AddToCartProps> = props => {
    const { addItem, getVariantQuantity, openDrawer } = useCart();

    const searchParams = useSearchParams();
    const selectedVariantId = searchParams.get('variant');
    const selectedVariant =
        props.product.variants.find(v => v.id == selectedVariantId) || props.product.variants[0];

    const onAddToCart = async (productVariantId: string, quantity: number) => {
        await addItem(productVariantId, quantity);
    };

    return (
        <AddToCartPure
            {...props}
            onAddToCart={onAddToCart}
            variant={selectedVariant}
            cartQuantity={getVariantQuantity(selectedVariant.id)}
            onViewCart={openDrawer}
        />
    );
};
