import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { RootContainer } from '@vendure/storefront-blocks/atoms';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import { HeroBannerRenderer } from './compounds/hero/banner';

interface BuilderTreeRendererProps {
    tree: SerializedNodes;
    theme: Record<string, string>;
}

interface NodeRendererProps extends BuilderTreeRendererProps {
    node: SerializedNode;
}

export function BuilderTreeRenderer({ tree, theme }: BuilderTreeRendererProps) {
    const rootNode = tree['ROOT'];
    if (!rootNode) return null;
    return <RenderRoot node={rootNode} tree={tree} theme={theme} />;
}

function RenderRoot({ node, tree, theme }: NodeRendererProps) {
    const children = (node.nodes || []).map(nodeId => {
        const currentChildNode = tree[nodeId];
        const componentName = (
            typeof currentChildNode.type == 'string'
                ? currentChildNode.type
                : currentChildNode.type.resolvedName
        ) as keyof typeof ComponentMap;
        if (componentName == 'HeroBanner')
            return <HeroBannerRenderer key={nodeId} node={currentChildNode} tree={tree} />;
        return null;
    });

    return <RootContainer theme={theme}>{children}</RootContainer>;
}
