import type { SerializedNode, SerializedNodes } from '@craftjs/core';
import { ComponentMap } from '@vendure/storefront-blocks/components-map';
import {
    DefaultProductGridProps,
    DefaultShopFiltersProps,
    DefaultShopPageProps,
    DefaultShopPaginationProps,
    DefaultShopToolbarProps,
    ShopPage,
} from '@vendure/storefront-blocks/compounds';
import type { FacetGroup, ShopPageRuntimeProps, ShopProduct } from '@vendure/storefront-blocks/types';
import { ShopFiltersRenderer } from './filters';
import { ShopPaginationRenderer } from './pagination';
import { ProductGridRenderer } from './product-grid';
import { ShopToolbarRenderer } from './toolbar';

interface ShopPageRendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
    shopcode: string;
    products: ShopProduct[];
    facetGroups: FacetGroup[];
    totalItems: number;
}

type GetSlotsReturn = Pick<
    ShopPageRuntimeProps,
    'FiltersSlot' | 'ToolbarSlot' | 'ProductGridSlot' | 'PaginationSlot'
>;

function getSlots({ node, tree, products, facetGroups, totalItems }: ShopPageRendererProps): GetSlotsReturn {
    const nodes = {} as GetSlotsReturn;
    Object.values(node.linkedNodes).forEach(id => {
        const slotNode = tree[id];
        if (slotNode) {
            const componentName = (
                typeof slotNode.type == 'string' ? slotNode.type : slotNode.type.resolvedName
            ) as keyof typeof ComponentMap;

            switch (componentName) {
                case 'ProductGrid':
                    nodes['ProductGridSlot'] = (
                        <ProductGridRenderer
                            {...DefaultProductGridProps}
                            {...slotNode.props}
                            products={products}
                        />
                    );
                    break;
                case 'ShopFilters':
                    nodes['FiltersSlot'] = (
                        <ShopFiltersRenderer
                            {...DefaultShopFiltersProps}
                            {...slotNode.props}
                            facetGroups={facetGroups}
                        />
                    );
                    break;
                case 'ShopToolbar':
                    nodes['ToolbarSlot'] = (
                        <ShopToolbarRenderer
                            {...DefaultShopToolbarProps}
                            {...slotNode.props}
                            totalItems={totalItems}
                        />
                    );
                    break;
                case 'ShopPagination':
                    nodes['PaginationSlot'] = (
                        <ShopPaginationRenderer
                            {...DefaultShopPaginationProps}
                            {...slotNode.props}
                            totalItems={totalItems}
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

export function ShopPageRenderer(props: ShopPageRendererProps) {
    const { node } = props;
    const pageProps = node.props;
    const slots = getSlots(props);

    return <ShopPage {...DefaultShopPageProps} {...pageProps} {...slots} totalItems={props.totalItems} />;
}
