// lib/page-data.ts
import { ErrorLike, OperationVariables, TypedDocumentNode } from '@apollo/client';
import type { SerializedNodes } from '@craftjs/core';
import { decompressFromBase64 } from 'lz-string';
import { getClient } from './apollo-client-server';
import { handleError } from './apollo-error';

type QueryConfig<TData, TVariables extends OperationVariables> = {
    query: TypedDocumentNode<TData, TVariables>;
    variables: TVariables;
};

type FetchPageDataOptions = {
    tags?: string[];
    revalidate?: number | false;
};

type PageDataResult<T> = {
    data: T | null;
    error: string | null;
};

// Overloads for type safety with different query counts
export async function fetchPageData<T1, V1 extends OperationVariables>(
    shopcode: string,
    queries: [QueryConfig<T1, V1>],
    options?: FetchPageDataOptions,
): Promise<PageDataResult<T1>>;

export async function fetchPageData<T1, V1 extends OperationVariables, T2, V2 extends OperationVariables>(
    shopcode: string,
    queries: [QueryConfig<T1, V1>, QueryConfig<T2, V2>],
    options?: FetchPageDataOptions,
): Promise<PageDataResult<T1 & T2>>;

export async function fetchPageData<
    T1,
    V1 extends OperationVariables,
    T2,
    V2 extends OperationVariables,
    T3,
    V3 extends OperationVariables,
>(
    shopcode: string,
    queries: [QueryConfig<T1, V1>, QueryConfig<T2, V2>, QueryConfig<T3, V3>],
    options?: FetchPageDataOptions,
): Promise<PageDataResult<T1 & T2 & T3>>;

export async function fetchPageData<
    T1,
    V1 extends OperationVariables,
    T2,
    V2 extends OperationVariables,
    T3,
    V3 extends OperationVariables,
    T4,
    V4 extends OperationVariables,
>(
    shopcode: string,
    queries: [QueryConfig<T1, V1>, QueryConfig<T2, V2>, QueryConfig<T3, V3>, QueryConfig<T4, V4>],
    options?: FetchPageDataOptions,
): Promise<PageDataResult<T1 & T2 & T3 & T4>>;

// Implementation signature
export async function fetchPageData<TData, TVariables extends OperationVariables>(
    shopcode: string,
    queries: QueryConfig<TData, TVariables>[],
    options?: FetchPageDataOptions,
): Promise<PageDataResult<TData>> {
    const client = getClient();

    const results = await Promise.all(
        queries.map(({ query, variables }) =>
            client.query({
                query,
                variables,
                context: {
                    headers: { shopcode },
                    fetchOptions: {
                        next: {
                            revalidate: options?.revalidate ?? 60,
                            tags: [`shop:${shopcode}`, ...(options?.tags ?? [])],
                        },
                    },
                },
                errorPolicy: 'all',
            }),
        ),
    );

    const firstError = results.find(r => r.error)?.error;
    if (firstError) {
        return {
            data: null,
            error: handleError(firstError as ErrorLike),
        };
    }

    const combinedData = results.reduce<Record<string, unknown>>(
        (acc, { data }) => ({ ...acc, ...data }),
        {},
    ) as TData;

    return { data: combinedData, error: null };
}

export function parseTheme(themeValue?: string): Record<string, string> {
    try {
        return themeValue ? JSON.parse(themeValue) : {};
    } catch {
        return {};
    }
}

export function parsePageTree(content?: string): SerializedNodes {
    if (!content) {
        return {};
    }
    try {
        const decompressedContent = decompressFromBase64(content);
        return JSON.parse(decompressedContent);
    } catch {
        return {};
    }
}
