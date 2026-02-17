import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Checkout',
    robots: { index: false, follow: false },
};

export default async function CheckoutPage({ params }: PageProps<'/shop/[shopcode]/checkout'>) {
    const { shopcode } = await params;
    const { data, error } = await fetchPageData(shopcode, [
        { query: getPageBySlugQuery, variables: { slug: 'checkout' } },
    ], { tags: ['page:checkout'], revalidate: 0 });

    if (error) {
        return <ErrorView title="Well… this is awkward" message={error} />;
    }

    if (!data?.pageBySlug?.publishedVersion) {
        notFound();
    }

    // All properties are fully typed
    const tree = parsePageTree(data.pageBySlug.publishedVersion.content);
    const theme = parseTheme(data.theme?.value);

    return <BuilderTreeRenderer tree={tree} theme={theme} shopcode={shopcode} data={{ type: 'default' }} />;
}
