import { getClient } from '@/lib/apollo-client-server';
import type { SerializedNode, SerializedNodes } from '@craftjs/core';

import { ErrorView } from '@/components/error-view';
import { handleError } from '@/lib/apollo-error';
import {
    DefaultFeaturedCollectionRuntimeProps,
    FeaturedCollections,
    FeaturedCollectionsBuilderProps,
} from '@vendure/storefront-blocks/compounds';
import { Collection } from '@vendure/storefront-blocks/types';
import { collectionListForFeaturedCollectionComponent } from './query';

interface RendererProps {
    node: SerializedNode;
    tree: SerializedNodes;
    shopcode: string;
}

export async function FeaturedCollectionsRenderer({ node, shopcode }: RendererProps) {
    const { collectionIds, ...featuredCollectionRuntimeProps } =
        node.props as FeaturedCollectionsBuilderProps;

    const { data, error } = await getClient().query({
        query: collectionListForFeaturedCollectionComponent,
        variables: { id: { in: collectionIds || [] } },
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

    if (!data || !data.collections) {
        return <ErrorView title="Well… this is awkward" message="Could not find the collections" />;
    }

    const collections: Collection[] = data.collections.items.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        image: c.featuredAsset?.source,
        slug: c.slug,
    }));

    return (
        <FeaturedCollections
            {...DefaultFeaturedCollectionRuntimeProps}
            {...featuredCollectionRuntimeProps}
            collections={collections}
        />
    );
}
