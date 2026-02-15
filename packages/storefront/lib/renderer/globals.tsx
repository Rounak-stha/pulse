'use client';

import type { SerializedNodes } from '@craftjs/core';
import { FooterRenderer } from './compounds/footer/main';
import { HeaderRenderer } from './compounds/header/main';

export function GlobalHeaderRenderer({ tree }: Readonly<{ tree: SerializedNodes }>) {
    const rootNode = tree['ROOT'];
    if (!rootNode?.nodes?.length) return null;

    for (const nodeId of rootNode.nodes) {
        const node = tree[nodeId];
        if (!node) continue;
        const componentName =
            typeof node.type === 'string' ? node.type : node.type.resolvedName;
        if (componentName === 'Header') {
            return <HeaderRenderer node={node} tree={tree} />;
        }
    }
    return null;
}

export function GlobalFooterRenderer({ tree }: Readonly<{ tree: SerializedNodes }>) {
    const rootNode = tree['ROOT'];
    if (!rootNode?.nodes?.length) return null;

    for (const nodeId of rootNode.nodes) {
        const node = tree[nodeId];
        if (!node) continue;
        const componentName =
            typeof node.type === 'string' ? node.type : node.type.resolvedName;
        if (componentName === 'Footer') {
            return <FooterRenderer node={node} tree={tree} />;
        }
    }
    return null;
}
