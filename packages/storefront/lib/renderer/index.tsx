import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { Suspense } from 'react';
import { RootContainer } from '@vendure/storefront-blocks/atoms';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import type { FacetGroup, Product, ShopProduct } from '@vendure/storefront-blocks/types';
import { HeroBannerRenderer } from './compounds/hero/banner';
import { CheckoutPageRenderer } from './page/checkout';
import { ProductPageRenderer } from './page/product';
import { ShopPageRenderer } from './page/shop';
import { FeaturedCollectionsRenderer } from './showcase/featured';

type ProductRenderData = { type: 'product'; product: Product };
type ShopRenderData = { type: 'shop'; products: ShopProduct[]; facetGroups: FacetGroup[]; totalItems: number };
type DefaultRenderData = { type: 'default' };

type BuilderRenderData = ProductRenderData | ShopRenderData | DefaultRenderData;

interface BuilderTreeRendererProps {
    tree: SerializedNodes;
    theme: Record<string, string>;
    shopcode: string;
    data: BuilderRenderData;
}

interface NodeRendererProps extends BuilderTreeRendererProps {
    node: SerializedNode;
}

function isProductPage(data?: BuilderRenderData): data is ProductRenderData {
    return data?.type === 'product';
}

function isShopPage(data?: BuilderRenderData): data is ShopRenderData {
    return data?.type === 'shop';
}

export function BuilderTreeRenderer({ tree, theme, shopcode, data }: BuilderTreeRendererProps) {
    const rootNode = tree['ROOT'];
    if (!rootNode) return null;
    return <RenderRoot node={rootNode} tree={tree} theme={theme} shopcode={shopcode} data={data} />;
}

function RenderRoot({ node, tree, theme, shopcode, data }: NodeRendererProps) {
    const children = (node.nodes || []).map(nodeId => {
        const currentChildNode = tree[nodeId];
        const componentName = (
            typeof currentChildNode.type == 'string'
                ? currentChildNode.type
                : currentChildNode.type.resolvedName
        ) as keyof typeof ComponentMap;
        // Header and Footer are rendered by the global layout
        if (componentName == 'Header' || componentName == 'Footer') return null;
        if (componentName == 'HeroBanner')
            return <HeroBannerRenderer key={nodeId} node={currentChildNode} tree={tree} />;
        if (componentName == 'FeaturedCollections')
            return (
                <Suspense key={nodeId} fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
                    <FeaturedCollectionsRenderer
                        node={currentChildNode}
                        tree={tree}
                        shopcode={shopcode}
                    />
                </Suspense>
            );
        if (componentName == 'ProductPage') {
            const product = isProductPage(data) ? data.product : null;

            if (!product) return null;

            return (
                <ProductPageRenderer
                    key={nodeId}
                    node={currentChildNode}
                    tree={tree}
                    product={product}
                    shopcode={shopcode}
                />
            );
        }

        if (componentName == 'CheckoutPage') {
            return (
                <CheckoutPageRenderer key={nodeId} node={currentChildNode} tree={tree} shopcode={shopcode} />
            );
        }

        if (componentName == 'ShopPage') {
            const shopData = isShopPage(data) ? data : null;
            return (
                <ShopPageRenderer
                    key={nodeId}
                    node={currentChildNode}
                    tree={tree}
                    shopcode={shopcode}
                    products={shopData?.products ?? []}
                    facetGroups={shopData?.facetGroups ?? []}
                    totalItems={shopData?.totalItems ?? 0}
                />
            );
        }

        return null;
    });

    return <RootContainer theme={theme}>{children}</RootContainer>;
}
