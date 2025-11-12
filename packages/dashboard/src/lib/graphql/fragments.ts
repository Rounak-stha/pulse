import { graphql, ResultOf } from './graphql.js';

export const assetFragment = graphql(`
    fragment Asset on Asset {
        id
        createdAt
        updatedAt
        name
        fileSize
        mimeType
        type
        preview
        source
        width
        height
        focalPoint {
            x
            y
        }
    }
`);

export type AssetFragment = ResultOf<typeof assetFragment>;

export const configurableOperationFragment = graphql(`
    fragment ConfigurableOperation on ConfigurableOperation {
        args {
            name
            value
        }
        code
    }
`);

export type ConfigurableOperationFragment = ResultOf<typeof configurableOperationFragment>;

export const configArgDefinitionFragment = graphql(`
    fragment ConfigArgDefinition on ConfigArgDefinition {
        name
        type
        required
        defaultValue
        list
        ui
        label
        description
    }
`);

export const configurableOperationDefFragment = graphql(
    `
        fragment ConfigurableOperationDef on ConfigurableOperationDefinition {
            args {
                ...ConfigArgDefinition
            }
            code
            description
        }
    `,
    [configArgDefinitionFragment],
);

export const errorResultFragment = graphql(`
    fragment ErrorResult on ErrorResult {
        errorCode
        message
    }
`);

export const pageVersionFragment = graphql(`
    fragment PageVersion on PageVersion {
        id
        createdAt
        updatedAt
        versionNumber
        content
        theme
        status
        publishedAt
        changeDescription
    }
`);

export const pageFragment = graphql(
    `
        fragment Page on Page {
            id
            createdAt
            updatedAt
            name
            slug
            description
            lastPublishedAt
            publishedVersion {
                ...PageVersion
            }
            draftVersion {
                ...PageVersion
            }
        }
    `,
    [pageVersionFragment],
);

export const pageListFragment = graphql(
    `
        fragment PageList on PageList {
            items {
                id
                name
                slug
                createdAt
                updatedAt
                publishedVersion {
                    id
                }
            }
            totalItems
        }
    `,
    [pageFragment],
);

export const publishedPageFragment = graphql(`
    fragment PublishedPage on PublishedPage {
        id
        name
        slug
        description
        content
        theme
        publishedAt
    }
`);

export type ConfigurableOperationDefFragment = ResultOf<typeof configurableOperationDefFragment>;
export type ConfigArgDefFragment = ResultOf<typeof configArgDefinitionFragment>;
export type PageVersionFragment = ResultOf<typeof pageVersionFragment>;
export type PageFragment = ResultOf<typeof pageFragment>;
export type PageListFragment = ResultOf<typeof pageListFragment>;
export type PublishedPageFragment = ResultOf<typeof publishedPageFragment>;
