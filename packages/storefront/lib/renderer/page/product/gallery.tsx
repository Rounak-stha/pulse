'use client';
import { ProductGallery as ProductGalleryPure } from '@vendure/storefront-blocks/compounds';
import type { ProductGalleryProps } from '@vendure/storefront-blocks/types';
import { useSearchParams } from 'next/navigation';
import type { FC } from 'react';

export const ProductGallery: FC<ProductGalleryProps> = props => {
    const searchParams = useSearchParams();
    const selectedVariantId = searchParams.get('variant');
    const selectedVariant =
        props.product.variants.find(v => v.id == selectedVariantId) || props.product.variants[0];

    const productImages = [...props.product.assets.filter(p => p.id !== props.product.featuredAsset?.id)];

    if (props.product.featuredAsset) {
        productImages.unshift(props.product.featuredAsset);
    }

    const productImagesById = new Map(productImages.map(item => [item.id, item]));
    const images = [
        ...props.product.variants.flatMap(v => v.assets).filter(asset => !productImagesById.has(asset.id)),
    ] as Array<{
        id: string;
        source: string;
        preview: string;
    }>;

    images.unshift(...productImages);

    const selectedImageIndex = images.findIndex(i => i.id === selectedVariant.featuredAsset?.id) || 0;

    return <ProductGalleryPure {...props} images={images} selectedImageIndex={selectedImageIndex} />;
};
