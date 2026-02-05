'use client';
import { ProductInfo as ProductInfoPure } from '@vendure/storefront-blocks/compounds';
import type { ProductInfoProps } from '@vendure/storefront-blocks/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';

export const ProductInfo: FC<ProductInfoProps> = props => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedVariantId = searchParams.get('variant');
    const selectedVariant =
        props.product.variants.find(v => v.id == selectedVariantId) || props.product.variants[0];

    const onVariantChange: ProductInfoProps['onVariantChange'] = variant => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('variant', variant.id);

        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    return <ProductInfoPure {...props} onVariantChange={onVariantChange} selectedVariant={selectedVariant} />;
};
