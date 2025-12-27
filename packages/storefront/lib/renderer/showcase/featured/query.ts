import { gql, TypedDocumentNode } from '@apollo/client';

type CollectionListForFeaturedCollectionComponent = {
    collections: {
        items: {
            id: string;
            name: string;
            slug: string;
            description: string;
            featuredAsset?: {
                id: string;
                source: string;
            };
        }[];
        totalItems: number;
    };
};

type collectionListForFeaturedCollectioComponentQueryVariables = {
    id: { in: string[] };
};

export const collectionListForFeaturedCollectionComponent: TypedDocumentNode<
    CollectionListForFeaturedCollectionComponent,
    collectionListForFeaturedCollectioComponentQueryVariables
> = gql`
    query collectionListForFeaturedCollectionBuilderComponent($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                description
                featuredAsset {
                    id
                    source
                }
            }
            totalItems
        }
    }
`;
