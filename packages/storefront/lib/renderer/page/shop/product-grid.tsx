'use client';
import { ProductGrid as ProductGridPure } from '@vendure/storefront-blocks/compounds';
import type { ProductGridProps } from '@vendure/storefront-blocks/types';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

export const ProductGridRenderer: FC<ProductGridProps> = props => {
    const router = useRouter();

    const onProductClick = (product: ProductGridProps['products'][number]) => {
        router.push(`/products/${product.slug}`);
    };

    return <ProductGridPure {...props} onProductClick={onProductClick} />;
};
