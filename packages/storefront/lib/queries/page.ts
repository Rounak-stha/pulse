import { gql, TypedDocumentNode } from '@apollo/client';

type GetPageBySlugQuery = {
    pageBySlug: {
        id: string;
        name: string;
        slug: string;
        publishedVersion: {
            id: string;
            content: string; // stringified JSON
        };
    };

    theme: {
        id: string;
        value: string;
    };
};

type GetPageBySlugQueryVariables = { slug: string };

export const getPageBySlugQuery: TypedDocumentNode<GetPageBySlugQuery, GetPageBySlugQueryVariables> = gql`
    query getPageBySLug($slug: String!) {
        pageBySlug(slug: $slug) {
            id
            name
            slug
            publishedVersion {
                id
                content
            }
        }

        theme {
            id
            value
        }
    }
`;

type PublishedBuilderGlobal = {
    region: string;
    content: string;
};

type GetPublishedBuilderGlobalsQuery = {
    publishedBuilderGlobals: PublishedBuilderGlobal[];
};

export const getPublishedBuilderGlobalsQuery: TypedDocumentNode<
    GetPublishedBuilderGlobalsQuery,
    Record<string, never>
> = gql`
    query GetPublishedBuilderGlobals {
        publishedBuilderGlobals {
            region
            content
        }
    }
`;

type ActiveShopQuery = {
    activeShop: {
        id: string;
        name: string;
        description: string | null;
        logo: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
    };
};

export const getActiveShopQuery: TypedDocumentNode<ActiveShopQuery, Record<string, never>> = gql`
    query GetActiveShop {
        activeShop {
            id
            name
            description
            logo
            seoTitle
            seoDescription
        }
    }
`;
