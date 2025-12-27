import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { RootContainer } from '@vendure/storefront-blocks/atoms';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import { FooterRenderer } from './compounds/footer/main';
import { HeaderRenderer } from './compounds/header/main';
import { HeroBannerRenderer } from './compounds/hero/banner';
import { FeaturedCollectionsRenderer } from './showcase/featured';

interface BuilderTreeRendererProps {
    tree: SerializedNodes;
    theme: Record<string, string>;
    shopcode: string;
}

interface NodeRendererProps extends BuilderTreeRendererProps {
    node: SerializedNode;
}

export function BuilderTreeRenderer({ tree, theme, shopcode }: BuilderTreeRendererProps) {
    const rootNode = tree['ROOT'];
    if (!rootNode) return null;
    return <RenderRoot node={rootNode} tree={tree} theme={theme} shopcode={shopcode} />;
}

function RenderRoot({ node, tree, theme, shopcode }: NodeRendererProps) {
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
        return null;
    });

    return <RootContainer theme={theme}>{children}</RootContainer>;
}
