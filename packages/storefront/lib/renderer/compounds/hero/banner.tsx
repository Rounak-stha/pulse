import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import {
    DeafultBadgeProps,
    DefaultHeadlineProps,
    DefaultSubTextProps,
} from '@vendure/storefront-blocks/atoms';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import { DefaultHeroBannerProps, HeroBanner } from '@vendure/storefront-blocks/compounds';
import { HeroBannerProps } from '@vendure/storefront-blocks/types';

interface HeroBannerRendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
}

type GetSlotsReturn = Pick<HeroBannerProps, 'SlotHeadline' | 'SlotBadge' | 'SlotButton' | 'SlotSubtext'>;

function getSlots({ node, tree }: HeroBannerRendererProps): GetSlotsReturn {
    const nodes = {} as GetSlotsReturn;
    Object.values(node.linkedNodes).forEach(id => {
        const node = tree[id];
        if (node) {
            const componentName = (
                typeof node.type == 'string' ? node.type : node.type.resolvedName
            ) as keyof typeof ComponentMap;
            console.log({ componentName });
            const Component = ComponentMap[componentName];
            if (!componentName || !Component) return;

            switch (componentName) {
                case 'Headline':
                    nodes['SlotHeadline'] = <Component {...DefaultHeadlineProps} {...node.props} />;
                    break;
                case 'Badge':
                    nodes['SlotBadge'] = <Component {...DeafultBadgeProps} {...node.props} />;
                    break;
                case 'Button':
                    nodes['SlotButton'] = <Component {...DeafultBadgeProps} {...node.props} />;
                    break;
                case 'Subtext':
                    nodes['SlotSubtext'] = <Component {...DefaultSubTextProps} {...node.props} />;
                    break;
                default:
                    return;
            }
        }
    });

    console.log({ nodes });
    return nodes;
}

export function HeroBannerRenderer({ node, tree }: HeroBannerRendererProps) {
    const props = node.props;
    const slots = getSlots({ node, tree });

    return <HeroBanner {...DefaultHeroBannerProps} {...props} {...slots} />;
}
