import { graphql } from '@/vdb/graphql/graphql.js';

export const shopPageProductsQuery = graphql(`
    query ShopPageProducts($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                description
                featuredAsset {
                    id
                    source
                    preview
                }
                variants {
                    id
                    price
                    currencyCode
                }
                facetValues {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
            totalItems
        }
    }
`);
