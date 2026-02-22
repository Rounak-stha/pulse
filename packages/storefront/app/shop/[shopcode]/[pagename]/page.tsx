import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';
import { cacheTag } from 'next/cache';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getPageData(shopcode: string, slug: string) {
    'use cache';
    cacheTag(`page:${slug}`, `shop:${shopcode}`);
    return fetchPageData(shopcode, [{ query: getPageBySlugQuery, variables: { slug } }]);
}

export async function generateMetadata({ params }: PageProps<'/shop/[shopcode]/[pagename]'>): Promise<Metadata> {
    const { shopcode, pagename } = await params;
    const { data } = await getPageData(shopcode, pagename);
    return { title: data?.pageBySlug?.name ?? pagename };
}

export default async function ShopPage({ params }: PageProps<'/shop/[shopcode]/[pagename]'>) {
    const { shopcode, pagename } = await params;
    const { data, error } = await getPageData(shopcode, pagename);

    if (error) {
        return <ErrorView title="Well… this is awkward" message={error} />;
    }

    if (!data?.pageBySlug?.publishedVersion) {
        notFound();
    }

    const tree = parsePageTree(data.pageBySlug.publishedVersion.content);
    const theme = parseTheme(data.theme?.value);

    return <BuilderTreeRenderer tree={tree} theme={theme} shopcode={shopcode} data={{ type: 'default' }} />;
}
