import { gql } from '@apollo/client';

export const getPageBySlugQuery = gql`
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
