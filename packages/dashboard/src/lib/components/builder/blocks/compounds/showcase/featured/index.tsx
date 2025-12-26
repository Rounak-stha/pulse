import { useNode } from '@craftjs/core';

import {
    DefaultFeaturedCollectionBuilderProps,
    FeaturedCollectionsBuilderProps,
    FeaturedCollections as FeaturedCollectionsPure,
    FeaturedCollectionsRuntimeProps,
} from '@/builder-blocks/compounds/index.js';
import { api } from '@/vdb/graphql/api.js';

import { useQuery } from '@tanstack/react-query';
import { collectionListForFeaturedCollectionBuilderComponent } from './featured.graphql.js';
import { FeaturedCollectionsSettings } from './settings.js';

export const FeaturedCollections: React.FC<FeaturedCollectionsBuilderProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    const { collectionIds, ...runtimeProps } = props;

    const { data: collectionsData, isLoading } = useQuery({
        queryKey: ['collectionsForFeaturedCollectionComponent', collectionIds],
        queryFn: () =>
            api.query(collectionListForFeaturedCollectionBuilderComponent, {
                options: {
                    take: 10,
                    filter: {
                        id: { in: collectionIds },
                    },
                },
            }),
        staleTime: 1000 * 60 * 5,
        enabled: collectionIds.length > 0,
    });

    const collections: FeaturedCollectionsRuntimeProps['collections'] =
        collectionsData?.collections.items.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.featuredAsset?.source,
            slug: c.slug,
        })) || [];

    return (
        <FeaturedCollectionsPure
            {...runtimeProps}
            collections={collections}
            ref={(ref: HTMLDivElement) => {
                connect(drag(ref));
            }}
            selected={selected}
        />
    );
};

(FeaturedCollections as any).craft = {
    displayName: 'FeaturedCollections',
    props: DefaultFeaturedCollectionBuilderProps,
    related: { settings: FeaturedCollectionsSettings },
};
