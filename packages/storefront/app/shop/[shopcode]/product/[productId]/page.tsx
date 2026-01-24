import { ErrorView } from '@/components/error-view';
import { getClient } from '@/lib/apollo-client-server';
import { handleError } from '@/lib/apollo-error';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { getProductQuery } from '@/lib/queries/product';
import { BuilderTreeRenderer } from '@/lib/renderer';
import { ErrorLike } from '@apollo/client';

export default async function ShopPage({ params }: PageProps<'/shop/[shopcode]/product/[productId]'>) {
    const { shopcode, productId } = await params;
    const { data, error: pageQueryError } = await getClient().query({
        query: getPageBySlugQuery,
        variables: { slug: 'products' },
        context: {
            headers: {
                shopcode: shopcode,
            },
        },
        errorPolicy: 'all',
    });

    const { data: productData, error: productQueryError } = await getClient().query({
        query: getProductQuery,
        variables: { id: productId },
        context: {
            headers: {
                shopcode: shopcode,
            },
        },
        errorPolicy: 'all',
    });

    if (pageQueryError || productQueryError) {
        const message = handleError((pageQueryError || productQueryError) as ErrorLike);
        return <ErrorView title="Well… this is awkward" message={message} />;
    }

    if (!data || !data.pageBySlug.publishedVersion || !productData || !productData.product) {
        return <ErrorView title="Well… this is awkward" message="You stumbled into a nonexistent page." />;
    }

    const tree = data?.pageBySlug.publishedVersion.content
        ? JSON.parse(data.pageBySlug.publishedVersion.content)
        : {};

    const product = productData.product;

    let theme: Record<string, string> = {};

    try {
        theme = data?.theme?.value ? JSON.parse(data?.theme?.value) : {};
    } catch {}

    return <BuilderTreeRenderer tree={tree} theme={theme} shopcode={shopcode} data={{ type: 'product', product }} />;
}
