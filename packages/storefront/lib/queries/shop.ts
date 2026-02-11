import { gql, TypedDocumentNode } from '@apollo/client';

export type ShopProductItem = {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset: {
        id: string;
        preview: string;
    } | null;
    variants: Array<{
        id: string;
        price: number;
        currencyCode: string;
    }>;
    facetValues: Array<{
        id: string;
        name: string;
        facet: {
            id: string;
            name: string;
        };
    }>;
};

export type GetProductsQuery = {
    products: {
        items: ShopProductItem[];
        totalItems: number;
    };
};

export type GetProductsQueryVariables = {
    options?: {
        skip?: number;
        take?: number;
        sort?: {
            name?: 'ASC' | 'DESC';
            createdAt?: 'ASC' | 'DESC';
        };
        filter?: {
            name?: { contains?: string };
        };
    };
};

export const getProductsQuery: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
    query GetProducts($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                description
                featuredAsset {
                    id
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
`;
