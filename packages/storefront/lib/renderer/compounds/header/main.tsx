import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { DefaultHeaderProps, Header } from '@vendure/storefront-blocks/compounds';

interface RendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
}

export function HeaderRenderer({ node }: RendererProps) {
    const props = node.props;

    return <Header {...DefaultHeaderProps} {...props} />;
}
