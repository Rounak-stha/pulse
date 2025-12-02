import { getClient } from '@/lib/apollo-client-server';
import { getPageBySlugQuery } from '@/lib/queries/page';
import { BuilderTreeRenderer } from '@/lib/renderer';

export default async function Home() {
    const { data, error } = await getClient().query({
        query: getPageBySlugQuery,
        variables: { slug: 'home' },
        context: {
            headers: {
                shopcode: 'shopcode',
            },
        },
    });
    const tree = data?.pageBySlug.publishedVersion.content
        ? JSON.parse(data.pageBySlug.publishedVersion.content)
        : {};

    let theme: Record<string, string> = {};

    try {
        theme = data?.theme?.value ? JSON.parse(data?.theme?.value) : {};
    } catch {}

    console.log({ tree, theme });
    return <BuilderTreeRenderer tree={tree} theme={theme} />;
}
