import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';
import { cacheTag } from 'next/cache';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Checkout',
    robots: { index: false, follow: false },
};

async function getCheckoutPageData(shopcode: string) {
    'use cache';
    cacheTag('page:checkout', `shop:${shopcode}`);
    return fetchPageData(shopcode, [{ query: getPageBySlugQuery, variables: { slug: 'checkout' } }]);
}

export default async function CheckoutPage({ params }: PageProps<'/shop/[shopcode]/checkout'>) {
    const { shopcode } = await params;
    const { data, error } = await getCheckoutPageData(shopcode);

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
