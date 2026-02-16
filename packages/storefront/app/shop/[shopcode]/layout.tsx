import { fetchPageData, parsePageTree } from '@/lib/page-data';
import { getPublishedBuilderGlobalsQuery } from '@/lib/queries/page';
import { GlobalFooterRenderer, GlobalHeaderRenderer } from '@/lib/renderer/globals';

export default async function ShopLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ shopcode: string }>;
}>) {
    const { shopcode } = await params;

    const { data } = await fetchPageData(shopcode, [
        { query: getPublishedBuilderGlobalsQuery, variables: {} },
    ]);

    const globals = data?.publishedBuilderGlobals ?? [];
    const headerGlobal = globals.find(g => g.region === 'header');
    const footerGlobal = globals.find(g => g.region === 'footer');

    const headerTree = parsePageTree(headerGlobal?.content);
    const footerTree = parsePageTree(footerGlobal?.content);

    return (
        <>
            <GlobalHeaderRenderer tree={headerTree} />
            {children}
            <GlobalFooterRenderer tree={footerTree} />
        </>
    );
}
