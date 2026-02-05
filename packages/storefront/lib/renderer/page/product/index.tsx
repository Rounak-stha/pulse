import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import {
    DefaultAddToCartProps,
    DefaultProductGalleryProps,
    DefaultProductInfoProps,
    DefaultProductPageProps,
    ProductPage,
} from '@vendure/storefront-blocks/compounds';
import type { Product, ProductPageRuntimeProps } from '@vendure/storefront-blocks/types';
import { AddToCart } from './add-to-cart';
import { ProductGallery } from './gallery';
import { ProductInfo } from './info';

interface ProductPageRendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
    product: Product;
    shopcode: string;
}

type GetSlotsReturn = Pick<
    ProductPageRuntimeProps,
    'ProductGallerySlot' | 'ProductInfoSlot' | 'AddToCartSlot'
>;

function getSlots({ node, tree, product, shopcode }: ProductPageRendererProps): GetSlotsReturn {
    const nodes = {} as GetSlotsReturn;
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
                    nodes['ProductGallerySlot'] = (
                        <ProductGallery {...DefaultProductGalleryProps} {...node.props} product={product} />
                    );
                    break;
                case 'ProductInfo':
                    nodes['ProductInfoSlot'] = (
                        <ProductInfo {...DefaultProductInfoProps} {...node.props} product={product} />
                    );
                    break;
                case 'AddToCart':
                    nodes['AddToCartSlot'] = (
                        <AddToCart
                            {...DefaultAddToCartProps}
                            {...node.props}
                            product={product}
                            shopcode={shopcode}
                        />
                    );
                    break;
                default:
                    return;
            }
        }
    });

    return nodes;
}

export function ProductPageRenderer({ node, tree, product, shopcode }: ProductPageRendererProps) {
    const props = node.props;
    const slots = getSlots({ node, tree, product, shopcode });

    return <ProductPage {...DefaultProductPageProps} {...props} {...slots} />;
}
