import { ErrorView } from '@/components/error-view';
import { fetchPageData, parsePageTree, parseTheme } from '@/lib/page-data';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { getProductQuery } from '@/lib/queries/product';
import { BuilderTreeRenderer } from '@/lib/renderer';

export default async function ProductPage({ params }: PageProps<'/shop/[shopcode]/product/[productId]'>) {
    const { shopcode, productId } = await params;
    const { data, error } = await fetchPageData(shopcode, [
        { query: getPageBySlugQuery, variables: { slug: 'product' } },
        { query: getProductQuery, variables: { id: productId } },
    ]);

    if (error) {
        return <ErrorView title="Well… this is awkward" message={error} />;
    }

    if (!data?.pageBySlug?.publishedVersion || !data?.product) {
        return <ErrorView title="Well… this is awkward" message="You stumbled into a nonexistent page." />;
    }

    // All properties are fully typed
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
