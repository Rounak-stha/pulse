import type { ShopPageBuilderProps, ShopPreviewData, ShopProduct, FacetGroup } from '@/builder-blocks/compounds/index.js';
import {
    DefaultProductGridProps,
    DefaultShopFiltersProps,
    DefaultShopPageProps,
    DefaultShopPaginationProps,
    DefaultShopToolbarProps,
    ShopPage as ShopPagePure,
    ShopPreviewProvider,
} from '@/builder-blocks/compounds/index.js';
import { api } from '@/vdb/graphql/api.js';
import { Element, useNode } from '@craftjs/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ShopFilters } from './filters/index.js';
import { mockFacetGroups, mockShopProducts } from './mock-data.js';
import { ShopPagination } from './pagination/index.js';
import { ProductGrid } from './productGrid/index.js';
import { ShopPageSettings } from './settings.js';
import { shopPageProductsQuery } from './shoppage.graphql.js';
import { ShopToolbar } from './toolbar/index.js';

function mapProductsData(data: any): { products: ShopProduct[]; facetGroups: FacetGroup[]; totalItems: number } {
    if (!data?.products) {
        return { products: [], facetGroups: [], totalItems: 0 };
    }

    const products: ShopProduct[] = data.products.items.map((item: any) => {
        const prices = item.variants.map((v: any) => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const currencyCode = item.variants[0]?.currencyCode || 'USD';

        return {
            productId: item.id,
            productName: item.name,
            slug: item.slug,
            description: item.description || undefined,
            image: item.featuredAsset
                ? { id: item.featuredAsset.id, preview: item.featuredAsset.preview }
                : null,
            price:
                minPrice === maxPrice
                    ? { type: 'single' as const, value: minPrice }
                    : { type: 'range' as const, min: minPrice, max: maxPrice },
            currencyCode,
        };
    });

    const facetMap = new Map<string, FacetGroup>();
    for (const item of data.products.items) {
        for (const fv of (item.facetValues || [])) {
            const facetId = fv.facet.id;
            if (!facetMap.has(facetId)) {
                facetMap.set(facetId, { id: facetId, name: fv.facet.name, values: [] });
            }
            const group = facetMap.get(facetId)!;
            if (!group.values.some((v: any) => v.id === fv.id)) {
                group.values.push({ id: fv.id, name: fv.name, count: 0 });
            }
        }
    }
    for (const item of data.products.items) {
        for (const fv of (item.facetValues || [])) {
            const group = facetMap.get(fv.facet.id);
            const value = group?.values.find((v: any) => v.id === fv.id);
            if (value) value.count++;
        }
    }

    return {
        products,
        facetGroups: Array.from(facetMap.values()),
        totalItems: data.products.totalItems,
    };
}

export const ShopPage: React.FC<ShopPageBuilderProps> = props => {
    const {
        connectors: { connect },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    const { collectionSlug, ...runtimeProps } = props;

    const { data: productsData } = useQuery({
        queryKey: ['shopPageProducts', collectionSlug],
        queryFn: () =>
            api.query(shopPageProductsQuery, {
                options: { take: 12 },
            }),
        staleTime: 1000 * 60 * 5,
    });

    const liveData = useMemo(() => mapProductsData(productsData), [productsData]);
    const hasLiveData = liveData.products.length > 0;

    const products = hasLiveData ? liveData.products : mockShopProducts;
    const facetGroups = hasLiveData ? liveData.facetGroups : mockFacetGroups;
    const totalItems = hasLiveData ? liveData.totalItems : mockShopProducts.length;

    const previewData = useMemo<ShopPreviewData>(
        () => ({ products, facetGroups, totalItems }),
        [products, facetGroups, totalItems],
    );

    const FiltersSlot = (
        <Element
            id="ShopFilters"
            is={ShopFilters}
            {...DefaultShopFiltersProps}
            facetGroups={facetGroups}
        />
    );
    const ToolbarSlot = (
        <Element
            id="ShopToolbar"
            is={ShopToolbar}
            {...DefaultShopToolbarProps}
            totalItems={totalItems}
        />
    );
    const ProductGridSlot = (
        <Element
            id="ProductGrid"
            is={ProductGrid}
            {...DefaultProductGridProps}
            products={products}
        />
    );
    const PaginationSlot = (
        <Element
            id="ShopPagination"
            is={ShopPagination}
            {...DefaultShopPaginationProps}
            totalItems={totalItems}
        />
    );

    return (
        <ShopPreviewProvider value={previewData}>
            <ShopPagePure
                FiltersSlot={FiltersSlot}
                ToolbarSlot={ToolbarSlot}
                ProductGridSlot={ProductGridSlot}
                PaginationSlot={PaginationSlot}
                {...runtimeProps}
                totalItems={totalItems}
                ref={(ref: HTMLDivElement) => {
                    connect(ref);
                }}
                selected={selected}
            />
        </ShopPreviewProvider>
    );
};

(ShopPage as any).craft = {
    displayName: 'Shop Page',
    props: DefaultShopPageProps,
    rules: {
        canDrag: false,
        canDrop: false,
    },
    related: {
        settings: ShopPageSettings,
    },
};
