import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: PageProps<'/shop/[shopcode]/[pagename]'>): Promise<Metadata> {
    const { shopcode, pagename } = await params;
    const { data } = await fetchPageData(shopcode, [
        { query: getPageBySlugQuery, variables: { slug: pagename } },
    ], { tags: [`page:${pagename}`] });

    const pageName = data?.pageBySlug?.name ?? pagename;

    return {
        title: pageName,
    };
}

export default async function ShopPage({ params }: PageProps<'/shop/[shopcode]/[pagename]'>) {
    const { shopcode, pagename } = await params;

    const { data, error } = await fetchPageData(shopcode, [
        { query: getPageBySlugQuery, variables: { slug: pagename } },
    ], { tags: [`page:${pagename}`] });

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
