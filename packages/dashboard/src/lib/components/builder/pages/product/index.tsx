import type {
    AddToCartProps,
    ProductGalleryProps,
    ProductInfoProps,
    ProductPageBuilderProps,
    Product
} from '@/builder-blocks/compounds/index.js';
import {
    DefaultProductGalleryProps,
    DefaultProductInfoProps,
    DefaultProductPageProps,
    DefaultAddToCartProps,
    ProductPage as ProductPagePure,
} from '@/builder-blocks/compounds/index.js';
import { api } from '@/vdb/graphql/api.js';
import { Element, useEditor, useNode } from '@craftjs/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AddToCart } from './addToCart/index.js';
import { ProductGallery } from './gallery/index.js';
import { ProductInfo } from './info/index.js';
import { productPageQuery } from './productpage.graphql.js';
import { ProductPageSettings } from './settings.js';

export const ProductPage: React.FC<ProductPageBuilderProps> = props => {
    const {
        id: nodeId,
        connectors: { connect },
        selected,
    } = useNode(state => ({
        id: state.id,
        selected: state.events.selected,
    }));

    const { actions, query } = useEditor();

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

    const images = [product.featuredAsset, ...product.assets.filter(p => p.id !== product.featuredAsset?.id)] as Array<{
        id: string;
        source: string;
        preview: string;
    }>;

    const productInfo = {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.variants[0]?.sku,
    };

    const selectedVariant: Product['variants'][number] = product.variants[0]
        ? {
              id: product.variants[0].id,
              name: product.variants[0].name,
              sku: product.variants[0].sku,
              price: product.variants[0].price,
              currencyCode: product.variants[0].currencyCode,
              stockLevel: product.variants[0].stockLevel as Product['variants'][number]['stockLevel'],
          }
        : {
              id: '',
              name: '',
              sku: '',
              price: 0,
              currencyCode: 'USD',
              stockLevel: 'IN_STOCK',
          };

    const ProductGallerySlot = (
        <Element
            key={product.id}
            id="ProductGallery"
            is={ProductGallery}
            {...DefaultProductGalleryProps}
            images={images}
        />
    );
    const ProdctInfoSlot = (
        <Element
            id="ProductInfo"
            is={ProductInfo}
            {...DefaultProductInfoProps}
            product={productInfo}
            selectedVariant={selectedVariant}
        />
    );
    const AddToCartSlot = (
        <Element id="AddToCart" is={AddToCart} {...DefaultAddToCartProps} variant={selectedVariant} />
    );

    useEffect(() => {
        if (!productData) return;

        const productPageNode = query.node(nodeId);
        const productGalleryNodeId = productPageNode.get().data.linkedNodes['ProductGallery'];
        const productInfoNodeId = productPageNode.get().data.linkedNodes['ProductInfo'];
        const addToCartNodeId = productPageNode.get().data.linkedNodes['AddToCart'];

        if (productGalleryNodeId) {
            actions.setProp(productGalleryNodeId, (props: ProductGalleryProps) => (props.images = images));
        }

        if (productInfoNodeId) {
            actions.setProp(productInfoNodeId, (props: ProductInfoProps) => {
                props.product = productInfo;
                props.selectedVariant = selectedVariant;
            });
        }

        if (addToCartNodeId) {
            actions.setProp(addToCartNodeId, (props: AddToCartProps) => {
                props.variant = selectedVariant;
            });
        }
    }, [productData]);
    return (
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
