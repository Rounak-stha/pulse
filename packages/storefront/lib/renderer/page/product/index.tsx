import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import { DefaultProductGalleryProps, DefaultProductInfoProps, DefaultAddToCartProps, DefaultProductPageProps, ProductPage } from '@vendure/storefront-blocks/compounds';
import type { Product, ProductGalleryProps, ProductInfoProps, ProductPageRuntimeProps } from '@vendure/storefront-blocks/types';

interface ProductPageRendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
    product: Product
}

type GetSlotsReturn = Pick<ProductPageRuntimeProps, 'ProductGallerySlot' | 'ProductInfoSlot' | 'AddToCartSlot'>;

function getProductGallerySlotProps({ node, product }: ProductPageRendererProps): ProductGalleryProps {
    const images = [product.featuredAsset, ...product.assets.filter(p => p.id !== product.featuredAsset?.id)] as Array<{
        id: string;
        source: string;
        preview: string;
    }>;
    return {
        ...DefaultProductGalleryProps,
        ...node.props,
        images,
    }
}

function getProductInfoSlotProps({ node, product }: ProductPageRendererProps): ProductInfoProps {
    const productInfo: ProductInfoProps['product'] = {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.variants.length ? product.variants[0].sku : '',
    }

    const selectedVariant: ProductInfoProps['selectedVariant'] = product.variants.length ? product.variants[0] : DefaultProductInfoProps.selectedVariant;
    return {
        ...DefaultProductInfoProps,
        ...node.props,
        product: productInfo,
        selectedVariant,
    }
}

function getSlots({ node, tree, product }: ProductPageRendererProps): GetSlotsReturn {
    const nodes = {} as GetSlotsReturn;
    console.log({ product })
    Object.values(node.linkedNodes).forEach(id => {
        const node = tree[id];
        if (node) {
            const componentName = (
                typeof node.type == 'string' ? node.type : node.type.resolvedName
            ) as keyof typeof ComponentMap;
            const Component = ComponentMap[componentName];
            if (!componentName || !Component) return;

            switch (componentName) {
                case 'ProductGallery':
                    const ProductGalleryComponent = ComponentMap['ProductGallery'];
                    nodes['ProductGallerySlot'] = <ProductGalleryComponent {...getProductGallerySlotProps({ node, tree, product })} />;
                    break;
                case 'ProductInfo':
                    const ProductInfoComponent = ComponentMap['ProductInfo'];
                    nodes['ProductInfoSlot'] = <ProductInfoComponent {...getProductInfoSlotProps({ node, tree, product })} />;
                    break;
                case 'AddToCart':
                    const AddToCartComponent = ComponentMap['AddToCart'];
                    nodes['AddToCartSlot'] = <AddToCartComponent {...DefaultAddToCartProps} {...node.props} variant={product.variants[0]} />;
                    break;
                default:
                    return;
            }
        }
    });

    return nodes;
}

export function ProductPageRenderer({ node, tree, product }: ProductPageRendererProps) {
    const props = node.props;
    const slots = getSlots({ node, tree, product });

    return <ProductPage {...DefaultProductPageProps} {...props} {...slots} />;
}
