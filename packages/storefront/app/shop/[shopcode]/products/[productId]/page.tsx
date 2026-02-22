import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { getProductQuery } from '@/lib/queries/product';
import { BuilderTreeRenderer } from '@/lib/renderer';
import { cacheTag } from 'next/cache';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getProductPageData(shopcode: string, productId: string) {
    'use cache';
    cacheTag(`page:product`, `product:${productId}`, `shop:${shopcode}`);
    return fetchPageData(shopcode, [
        { query: getPageBySlugQuery, variables: { slug: 'products' } },
        { query: getProductQuery, variables: { id: productId } },
    ]);
}

export async function generateMetadata({
    params,
}: PageProps<'/shop/[shopcode]/products/[productId]'>): Promise<Metadata> {
    const { shopcode, productId } = await params;
    const { data } = await getProductPageData(shopcode, productId);

    const product = data?.product;

    return {
        title: product?.name,
        description: product?.description ?? undefined,
        openGraph: product
            ? {
                  title: product.name,
                  description: product.description ?? undefined,
                  images: product.featuredAsset ? [{ url: product.featuredAsset.preview }] : undefined,
              }
            : undefined,
    };
}

export default async function ProductPage({ params }: PageProps<'/shop/[shopcode]/products/[productId]'>) {
    const { shopcode, productId } = await params;
    const { data, error } = await getProductPageData(shopcode, productId);

    if (error) {
        return <ErrorView title="Well… this is awkward" message={error} />;
    }

    if (!data?.pageBySlug?.publishedVersion || !data?.product) {
        notFound();
    }

    const tree = parsePageTree(data.pageBySlug.publishedVersion.content);
    const theme = parseTheme(data.theme?.value);
    const product = data.product;

    return (
        <BuilderTreeRenderer
            tree={tree}
            theme={theme}
            shopcode={shopcode}
            data={{ type: 'product', product }}
        />
    );
}
