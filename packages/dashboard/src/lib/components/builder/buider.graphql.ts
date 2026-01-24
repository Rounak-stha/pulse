import { pageFragment, pageVersionFragment, publishedPageFragment } from '@/vdb/graphql/fragments.js';
import { graphql } from '@/vdb/graphql/graphql.js';

export const getPagesQuery = graphql(`
    query GetPages($options: PageListOptions) {
        pages(options: $options) {
            items {
                id
                name
                slug
                system
                createdAt
                updatedAt
                publishedVersion {
                    id
                }
            }
            totalItems
        }
    }
`);

export const getPageQuery = graphql(
    `
        query GetPage($id: ID!) {
            page(id: $id) {
                ...Page
            }
            theme {
                id
                value
            }
        }
    `,
    [pageFragment],
);

export const getPageBySlugQuery = graphql(
    `
        query GetPageBySlug($slug: String!) {
            pageBySlug(slug: $slug) {
                ...Page
            }
        }
    `,
    [pageFragment],
);

export const getPageVersionQuery = graphql(
    `
        query GetPageVersion($id: ID!) {
            pageVersion(id: $id) {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const getPageVersionsQuery = graphql(
    `
        query GetPageVersions($pageId: ID!) {
            pageVersions(pageId: $pageId) {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const getPageDraftVersionQuery = graphql(
    `
        query GetPageDraftVersion($pageId: ID!) {
            pageDraftVersion(pageId: $pageId) {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const getPublishedPageQuery = graphql(
    `
        query GetPublishedPage($slug: String!) {
            publishedPage(slug: $slug) {
                ...PublishedPage
            }
        }
    `,
    [publishedPageFragment],
);

// Mutations
export const createPageMutation = graphql(
    `
        mutation CreatePage($input: CreatePageInput!) {
            createPage(input: $input) {
                ...Page
            }
        }
    `,
    [pageFragment],
);

export const updatePageMutation = graphql(
    `
        mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
            updatePage(id: $id, input: $input) {
                ...Page
            }
        }
    `,
    [pageFragment],
);

export const deletePageMutation = graphql(`
    mutation DeletePage($id: ID!) {
        deletePage(id: $id) {
            result
            message
        }
    }
`);

export const savePageDraftMutation = graphql(
    `
        mutation SavePageDraft($input: SavePageVersionInput!) {
            savePageDraft(input: $input) {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const publishPageMutation = graphql(
    `
        mutation PublishPage($input: PublishPageInput!) {
            publishPage(input: $input) {
                ...Page
            }
        }
    `,
    [pageFragment],
);

export const restorePageVersionMutation = graphql(
    `
        mutation RestorePageVersion($input: RestorePageVersionInput!) {
            restorePageVersion(input: $input) {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const deletePageVersionMutation = graphql(`
    mutation DeletePageVersion($id: ID!) {
        deletePageVersion(id: $id) {
            result
            message
        }
    }
`);

export const updateThemeMutation = graphql(`
    mutation updateTheme($input: UpdateThemeInput!) {
        updateTheme(input: $input) {
            id
            value
        }
    }
`);
