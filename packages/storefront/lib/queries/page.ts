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
