import { graphql } from '@/vdb/graphql/graphql.js';

export const collectionListForFeaturedCollectionBuilderComponent = graphql(`
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
`);
