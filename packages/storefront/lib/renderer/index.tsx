import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { RootContainer } from '@vendure/storefront-blocks/atoms';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import { FooterRenderer } from './compounds/footer/main';
import { HeaderRenderer } from './compounds/header/main';
import { HeroBannerRenderer } from './compounds/hero/banner';
import { FeaturedCollectionsRenderer } from './showcase/featured';
import { Product } from '@vendure/storefront-blocks/types';
import { ProductPageRenderer } from './page/product';

type ProductRenderData = { type: 'product'; product: Product };
type DefaultRenderData = { type: 'default' };

type BuilderRenderData = ProductRenderData | DefaultRenderData;

interface BuilderTreeRendererProps {
    tree: SerializedNodes;
    theme: Record<string, string>;
    shopcode: string;
    data: BuilderRenderData;
}

interface NodeRendererProps extends BuilderTreeRendererProps {
    node: SerializedNode;
}

function isProductPage(
  data?: BuilderRenderData
): data is ProductRenderData {
  return data?.type === 'product';
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
        if (componentName == 'HeroBanner')
            return <HeroBannerRenderer key={nodeId} node={currentChildNode} tree={tree} />;
        if (componentName == 'Header')
            return <HeaderRenderer key={nodeId} node={currentChildNode} tree={tree} />;
        if (componentName == 'Footer')
            return <FooterRenderer key={nodeId} node={currentChildNode} tree={tree} />;
        if (componentName == 'FeaturedCollections')
            return (
                <FeaturedCollectionsRenderer
                    key={nodeId}
                    node={currentChildNode}
                    tree={tree}
                    shopcode={shopcode}
                />
            );
        if (componentName == 'ProductPage') {
            const product = isProductPage(data) ?  data.product : null;

            if (!product) return null;

            return (
                <ProductPageRenderer
                    key={nodeId}
                    node={currentChildNode}
                    tree={tree}
                    product={product}
                />
            );
        }
        return null;
    });

    return <RootContainer theme={theme}>{children}</RootContainer>;
}
