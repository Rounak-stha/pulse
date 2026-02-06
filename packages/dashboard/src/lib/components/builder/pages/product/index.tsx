import type {
    Product,
    ProductPageBuilderProps,
    ProductPreviewData,
} from '@/builder-blocks/compounds/index.js';
import {
    DefaultAddToCartProps,
    DefaultProductGalleryProps,
    DefaultProductInfoProps,
    DefaultProductPageProps,
    ProductPage as ProductPagePure,
    ProductPreviewProvider,
} from '@/builder-blocks/compounds/index.js';
import { api } from '@/vdb/graphql/api.js';
import { Element, useNode } from '@craftjs/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AddToCart } from './addToCart/index.js';
import { ProductGallery } from './gallery/index.js';
import { ProductInfo } from './info/index.js';
import { productPageQuery } from './productpage.graphql.js';
import { ProductPageSettings } from './settings.js';

export const ProductPage: React.FC<ProductPageBuilderProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    const { productId, ...runtimeProps } = props;

    const { data: productData } = useQuery({
        queryKey: ['productPage', productId],
        queryFn: () => api.query(productPageQuery, { id: productId }),
        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
    });

    const product = (productData?.product || DefaultProductPageProps.product) as Product;

    const handleAddToCart = (variantId: string, quantity: number) => {
        console.log('Add to cart (builder preview):', { variantId, quantity });
    };

    const images = [
        product.featuredAsset,
        ...product.assets.filter(p => p.id !== product.featuredAsset?.id),
    ] as Array<{
        id: string;
        source: string;
        preview: string;
    }>;

    const selectedVariant: Product['variants'][number] = product.variants[0];

    const previewData = useMemo<ProductPreviewData>(
        () => ({ product, selectedVariant, images }),
        [product, selectedVariant, images],
    );

    const ProductGallerySlot = (
        <Element
            key={product.id}
            id="ProductGallery"
            is={ProductGallery}
            {...DefaultProductGalleryProps}
        />
    );
    const ProdctInfoSlot = (
        <Element
            id="ProductInfo"
            is={ProductInfo}
            {...DefaultProductInfoProps}
        />
    );
    const AddToCartSlot = (
        <Element id="AddToCart" is={AddToCart} {...DefaultAddToCartProps} />
    );

    return (
        <ProductPreviewProvider value={previewData}>
            <ProductPagePure
                product={product}
                onAddToCart={handleAddToCart}
                ProductGallerySlot={ProductGallerySlot}
                ProductInfoSlot={ProdctInfoSlot}
                AddToCartSlot={AddToCartSlot}
                SlotFlexibleZone={
                    <Element
                        id="flexible-zone"
                        is="div"
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]"
                        canvas
                    >
                        <p className="text-gray-400 text-center">
                            Add sections here (Reviews, Related Products, Specifications, etc.)
                        </p>
                    </Element>
                }
                {...runtimeProps}
                ref={(ref: HTMLDivElement) => {
                    connect(ref);
                }}
                selected={selected}
            />
        </ProductPreviewProvider>
    );
};

(ProductPage as any).craft = {
    displayName: 'Product Page',
    props: DefaultProductPageProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ProductPageSettings,
    },
};
