import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { getProductsQuery, GetProductsQuery } from '@/lib/queries/shop';
import { BuilderTreeRenderer } from '@/lib/renderer';
import type { FacetGroup, ShopProduct } from '@vendure/storefront-blocks/types';
import type { Metadata } from 'next';
import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';

function mapProductsToShopData(data: GetProductsQuery): {
    products: ShopProduct[];
    facetGroups: FacetGroup[];
    totalItems: number;
} {
    if (!data?.products) {
        return { products: [], facetGroups: [], totalItems: 0 };
    }

    const products: ShopProduct[] = data.products.items.map(item => {
        const minPrice = Math.min(...item.variants.map(v => v.price));
        const maxPrice = Math.max(...item.variants.map(v => v.price));
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
        for (const fv of item.facetValues) {
            const facetId = fv.facet.id;
            if (!facetMap.has(facetId)) {
                facetMap.set(facetId, {
                    id: facetId,
                    name: fv.facet.name,
                    values: [],
                });
            }
            const group = facetMap.get(facetId)!;
            if (!group.values.some(v => v.id === fv.id)) {
                group.values.push({ id: fv.id, name: fv.name, count: 0 });
            }
        }
    }

    for (const item of data.products.items) {
        for (const fv of item.facetValues) {
            const group = facetMap.get(fv.facet.id);
            const value = group?.values.find(v => v.id === fv.id);
            if (value) value.count++;
        }
    }

    return {
        products,
        facetGroups: Array.from(facetMap.values()),
        totalItems: data.products.totalItems,
    };
}

export const metadata: Metadata = {
    title: 'Shop',
};

async function getShopPageLayout(shopcode: string) {
    'use cache';
    cacheTag('page:shop', `shop:${shopcode}`);
    return fetchPageData(shopcode, [{ query: getPageBySlugQuery, variables: { slug: 'shop' } }]);
}

async function getShopProducts(
    shopcode: string,
    options: { take: number; skip: number; sort?: { name?: 'ASC' | 'DESC'; createdAt?: 'ASC' | 'DESC' } },
) {
    'use cache';
    cacheTag('products', `shop:${shopcode}`);
    return fetchPageData(shopcode, [{ query: getProductsQuery, variables: { options } }]);
}

export default async function ShopProductsPage({
    params,
    searchParams: searchParamsPromise,
}: PageProps<'/shop/[shopcode]/shop'>) {
    const { shopcode } = await params;
    const searchParams = await searchParamsPromise;

    const page = Number(searchParams?.page) || 1;
    const perPage = Number(searchParams?.perPage) || 12;
    const sort = (searchParams?.sort as string) || undefined;

    let sortOption: { name?: 'ASC' | 'DESC'; createdAt?: 'ASC' | 'DESC' } | undefined = undefined;
    if (sort === 'NAME_ASC') sortOption = { name: 'ASC' };
    else if (sort === 'NAME_DESC') sortOption = { name: 'DESC' };
    else if (sort === 'NEWEST') sortOption = { createdAt: 'DESC' };

    const [layoutResult, productsResult] = await Promise.all([
        getShopPageLayout(shopcode),
        getShopProducts(shopcode, {
            take: perPage,
            skip: (page - 1) * perPage,
            ...(sortOption ? { sort: sortOption } : {}),
        }),
    ]);

    const error = layoutResult.error || productsResult.error;
    if (error) {
        return <ErrorView title="Well… this is awkward" message={error} />;
    }

    if (!layoutResult.data?.pageBySlug?.publishedVersion) {
        notFound();
    }

    const tree = parsePageTree(layoutResult.data.pageBySlug.publishedVersion.content);
    const theme = parseTheme(layoutResult.data.theme?.value);
    const { products, facetGroups, totalItems } = mapProductsToShopData(productsResult.data!);

    return (
        <BuilderTreeRenderer
            tree={tree}
            theme={theme}
            shopcode={shopcode}
            data={{ type: 'shop', products, facetGroups, totalItems }}
        />
    );
}
