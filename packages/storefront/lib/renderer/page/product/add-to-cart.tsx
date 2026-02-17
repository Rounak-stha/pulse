'use client';
import { useSearchParams } from 'next/navigation';

import { ApolloProvider } from '@/app/providers/apollo';
import { addItemToOrderMutation } from '@/lib/queries/cart';
import { useMutation } from '@apollo/client/react';
import { AddToCart as AddToCartPure } from '@vendure/storefront-blocks/compounds';
import type { AddToCartProps as AddToCartPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';

type AddToCartProps = AddToCartPropsPure & {
    shopcode: string;
};

export const AddToCart: FC<AddToCartProps> = props => {
    return (
        <ApolloProvider>
            <AddToCartInner {...props} />
        </ApolloProvider>
    );
};

const AddToCartInner: FC<AddToCartProps> = props => {
    const [addToCart] = useMutation(addItemToOrderMutation, {
        context: {
            headers: {
                shopcode: props.shopcode,
            },
        },
    });

    const searchParams = useSearchParams();
    const selectedVariantId = searchParams.get('variant');
    const selectedVariant =
        props.product.variants.find(v => v.id == selectedVariantId) || props.product.variants[0];
    const onAddToCart = async (productVariantId: string, quantity: number) => {
        await addToCart({ variables: { productVariantId, quantity } });
    };
    return <AddToCartPure {...props} onAddToCart={onAddToCart} variant={selectedVariant} />;
};
