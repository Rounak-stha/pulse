import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { DefaultFooterProps, Footer } from '@vendure/storefront-blocks/compounds';

interface RendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
}

export function FooterRenderer({ node }: RendererProps) {
    const props = node.props;
    return <Footer {...DefaultFooterProps} {...props} />;
}
