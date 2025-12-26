import { ErrorView } from '@/components/error-view';
import { getClient } from '@/lib/apollo-client-server';
import { handleError } from '@/lib/apollo-error';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';

export default async function ShopPage({ params }: PageProps<'/shop/[shopcode]/[pagename]'>) {
    const { shopcode, pagename } = await params;
    const { data, error } = await getClient().query({
        query: getPageBySlugQuery,
        variables: { slug: pagename },
        context: {
            headers: {
                shopcode: shopcode,
            },
        },
        errorPolicy: 'all',
    });

    if (error) {
        const message = handleError(error);
        return <ErrorView title="Well… this is awkward" message={message} />;
    }

    if (!data || !data.pageBySlug.publishedVersion) {
        return <ErrorView title="Well… this is awkward" message="You stumbled into a nonexistent page." />;
    }

    const tree = data?.pageBySlug.publishedVersion.content
        ? JSON.parse(data.pageBySlug.publishedVersion.content)
        : {};

    let theme: Record<string, string> = {};

    try {
        theme = data?.theme?.value ? JSON.parse(data?.theme?.value) : {};
    } catch {}

    return <BuilderTreeRenderer tree={tree} theme={theme} shopcode={shopcode} />;
}
