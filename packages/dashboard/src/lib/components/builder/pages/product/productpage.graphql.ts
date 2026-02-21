import { graphql } from '@/vdb/graphql/graphql.js';

export const productPageQuery = graphql(`
    query ProductPage($id: ID!) {
        product(id: $id) {
            id
            name
            slug
            description
            featuredAsset {
                id
                source
                preview
            }
            assets {
                id
                source
                preview
            }
            variants {
                id
                name
                sku
                stockLevel
                price
                priceWithTax
                currencyCode
                featuredAsset {
                    id
                    source
                    preview
                }
                assets {
                    id
                    source
                    preview
                }
            }
        }
    }
`);

export const ProductPageSetttingsSearchQuery = graphql(`
    query ProductPageSetttingsSearchQuery($options: ProductListOptions) {
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
                assets {
                    id
                    source
                    preview
                }
                variants {
                    id
                    name
                    sku
                    stockLevel
                    price
                    currencyCode
                    featuredAsset {
                        id
                        source
                        preview
                    }
                    assets {
                        id
                        source
                        preview
                    }
                }
            }
        }
    }
`);
