import { gql, TypedDocumentNode } from '@apollo/client';

import type { Product } from '@vendure/storefront-blocks/types';

type GetProductQuery = {
    product: Product;
};

type GetProductQueryVariables = { id: string };

export const getProductQuery: TypedDocumentNode<GetProductQuery, GetProductQueryVariables> = gql`
    query Product($id: ID!) {
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
`;
