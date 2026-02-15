import { graphql } from '@/vdb/graphql/graphql.js';

export const getBuilderGlobalQuery = graphql(`
    query GetBuilderGlobal($region: String!) {
        builderGlobal(region: $region) {
            id
            createdAt
            updatedAt
            region
            content
            draftContent
        }
    }
`);

export const getBuilderGlobalsQuery = graphql(`
    query GetBuilderGlobals {
        builderGlobals {
            id
            region
            content
            draftContent
        }
    }
`);

export const saveBuilderGlobalDraftMutation = graphql(`
    mutation SaveBuilderGlobalDraft($input: SaveBuilderGlobalDraftInput!) {
        saveBuilderGlobalDraft(input: $input) {
            id
            region
            content
            draftContent
        }
    }
`);

export const publishBuilderGlobalMutation = graphql(`
    mutation PublishBuilderGlobal($input: PublishBuilderGlobalInput!) {
        publishBuilderGlobal(input: $input) {
            id
            region
            content
            draftContent
        }
    }
`);
