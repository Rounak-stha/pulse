import {
    createPageMutation as createPageGql,
    getPageQuery,
    publishPageMutation as publishPageGql,
    savePageDraftMutation as savePageDraftGql,
    updateThemeMutation as updateThemeGql,
} from '@/vdb/components/builder/builder.graphql.js';
import {
    getBuilderGlobalQuery,
    publishBuilderGlobalMutation,
    saveBuilderGlobalDraftMutation,
} from '@/vdb/components/builder/globals.graphql.js';
import { useEditor } from '@craftjs/core';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ResultOf } from 'gql.tada';
import LZString from 'lz-string';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../graphql/api.js';
import { setThemeOnCanvas } from '../lib/builder.js';

type Mode = 'edit' | 'preview';

/**
 * @description
 * Provides information about the builder
 * status.
 */
export interface BuilderContext {
    /**
     * @description
     * Page Information (for pages) or region (for globals)
     */
    page: ResultOf<typeof getPageQuery>['page'] | null;
    region?: string;
    /**
     * @description
     * The theme for the Shop
     */
    theme?: ResultOf<typeof getPageQuery>['theme'];
    /**
     * @description
     * Whether the builder is loading
     */
    isLoading: boolean;
    /**
     * @description
     * The mode the builder is currently in
     */
    mode: Mode;
    /**
     * The initial editor content string
     */
    content: string | undefined;
    /**
     * @description
     * Function to update the mode
     */
    changeMode: (mode: Mode) => void;
    /**
     * @description
     * The function to save the page or global.
     */
    save: (changeDescription?: string) => Promise<void>;
    /**
     * @description
     * The function to publish the page or global.
     */
    publish: () => Promise<void>;
    /**
     * @description
     * The function to create a page.
     */
    createPage: (input: { name: string; slug: string; description?: string }) => Promise<void>;
    /**
     * @description
     * The function to change to a different page.
     */
    changePage: (pageId: string) => Promise<void>;
    /**
     * @description
     * function to refresh the page or global
     */
    refresh: ReturnType<typeof useQuery>['refetch'];
    /**
     * @description
     * The function to update Shop theme.
     */
    updateTheme: (input: { id: string; value: string }) => Promise<void>;
    /**
     * @description
     * The function to get the page content.
     */
    getPageContent: () => string;
    /**
     * @description
     * Saving State
     */
    isSaving: boolean;
    /**
     * @description
     * Publishing State.
     */
    isPublishing: boolean;

    /**
     * @description
     * Creating State
     */
    isCreating: boolean;

    /**
     * @description
     * Whether this is a global builder (vs page builder)
     */
    isGlobal: boolean;
}

export function getBuilderPageQueryOptions(pageId: string) {
    return queryOptions({
        queryKey: ['builder-page', pageId],
        queryFn: () => api.query(getPageQuery, { id: pageId }),
        enabled: !!pageId,
    });
}

export function getBuilderGlobalQueryOptions(region: string) {
    return queryOptions({
        queryKey: ['builder-global', region],
        queryFn: () => api.query(getBuilderGlobalQuery, { region }),
        enabled: !!region,
    });
}

export const BuilderContext = createContext<BuilderContext | null>(null);

export function BuilderProvider({
    pageId,
    region,
    children,
}: Readonly<{ pageId?: string; region?: string; children: React.ReactNode }>) {
    const navigate = useNavigate();
    const { actions, query } = useEditor();
    const queryClient = useQueryClient();
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const [mode, setMode] = useState<Mode>('edit');
    const [content, setContent] = useState<string>();

    // Determine if this is a global builder
    const isGlobal = !!region;

    // Fetch page data if it's a page builder
    const {
        data: pageData,
        isLoading: isPageLoading,
        refetch: refetchPage,
    } = useQuery(getBuilderPageQueryOptions(pageId ?? ''));

    // Fetch global data if it's a global builder
    const {
        data: globalData,
        isLoading: isGlobalLoading,
        refetch: refetchGlobal,
    } = useQuery(getBuilderGlobalQueryOptions(region ?? ''));

    // Save draft mutation for pages
    const savePageDraftMutation = useMutation({
        mutationFn: (input: { content: string; theme?: string; changeDescription?: string }) =>
            api.mutate(savePageDraftGql, {
                input: {
                    pageId: pageId!,
                    ...input,
                },
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['page-draft', pageId] });
            toast.success('Draft saved');
        },
        onError: () => toast.error('Failed to save'),
    });

    // Save draft mutation for globals
    const saveGlobalDraftMutation = useMutation({
        mutationFn: (content: string) =>
            api.mutate(saveBuilderGlobalDraftMutation, {
                input: { region: region!, content },
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['builder-global', region] });
            toast.success('Draft saved');
        },
        onError: () => toast.error('Failed to save'),
    });

    const getPageContent = () => {
        const json = query.serialize();
        const compressed = LZString.compressToBase64(json);

        return compressed;
    };

    const decompressContent = (compressed: string) => {
        const decompressed = LZString.decompressFromBase64(compressed);
        return decompressed;
    };

    const changeMode = (mode: Mode) => setMode(mode);

    // Publish mutation for pages
    const publishPageMutation = useMutation({
        mutationFn: (input: { content: string; theme?: string; changeDescription?: string }) =>
            api.mutate(publishPageGql, {
                input: {
                    pageId: pageId!,
                    ...input,
                },
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['page-draft', pageId] });
            void queryClient.invalidateQueries({ queryKey: ['pages'] });
            toast.success('Page published');
        },
        onError: () => toast.error('Failed to publish'),
    });

    // Publish mutation for globals
    const publishGlobalMutation = useMutation({
        mutationFn: (content: string) =>
            api.mutate(publishBuilderGlobalMutation, {
                input: { region: region!, content },
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['builder-global', region] });
            toast.success('Global published');
        },
        onError: () => toast.error('Failed to publish'),
    });

    // Create page mutation
    const createMutation = useMutation({
        mutationFn: (input: { name: string; slug: string; description?: string }) => {
            const createInput = { ...input, content: '' };
            if (!pageId) createInput.content = getPageContent();
            return api.mutate(createPageGql, { input: createInput });
        },
    });

    const themeUpdateMutation = useMutation({
        mutationFn: (input: { id: string; value: string }) =>
            api.mutate(updateThemeGql, {
                input,
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['shop-theme'] });
            toast.success('Theme updated');
        },
        onError: () => toast.error('Failed to update theme'),
    });

    // Load content into editor based on whether it's a page or global
    useEffect(() => {
        if (isGlobal) {
            // Handle global content loading
            if (!isGlobalLoading) {
                const content = globalData?.builderGlobal?.draftContent || globalData?.builderGlobal?.content;
                if (content) {
                    try {
                        const decompressed = decompressContent(content);
                        actions.deserialize(decompressed);
                        setIsContentLoaded(true);
                    } catch {
                        setIsContentLoaded(true);
                    }
                } else {
                    setIsContentLoaded(true);
                }
            }
        } else {
            // Handle page content loading
            if (!isPageLoading) {
                const content =
                    pageData?.page?.draftVersion?.content || pageData?.page?.publishedVersion?.content;
                const theme = pageData?.theme.value;
                if (theme) {
                    setThemeOnCanvas(theme);
                }
                if (content) {
                    try {
                        const decompressedContent = decompressContent(content);
                        actions.deserialize(decompressedContent);
                        setIsContentLoaded(true);
                    } catch (error) {
                        console.error('Failed to load page content:', error);
                        setIsContentLoaded(true);
                    }
                } else {
                    // Empty Page
                    setIsContentLoaded(true);
                }
            }
        }
    }, [pageData, globalData, isPageLoading, isGlobalLoading, pageId, region, isGlobal]);

    // Reset loaded state when pageId or region changes
    useEffect(() => {
        setIsContentLoaded(false);
    }, [pageId, region]);

    // Save handler - handles both pages and globals
    const save = useCallback(
        async (changeDescription?: string) => {
            const pageContent = getPageContent();

            if (isGlobal) {
                if (!region) {
                    console.error('Cannot save global without region');
                    return;
                }
                await saveGlobalDraftMutation.mutateAsync(pageContent);
            } else {
                if (!pageId) {
                    console.error('Cannot save page without pageId');
                    return;
                }
                await savePageDraftMutation.mutateAsync({
                    content: pageContent,
                    changeDescription,
                });
            }
        },
        [isGlobal, pageId, region, query, savePageDraftMutation, saveGlobalDraftMutation],
    );

    // Publish handler - handles both pages and globals
    const publish = useCallback(
        async (changeDescription?: string) => {
            const pageContent = getPageContent();

            if (isGlobal) {
                if (!region) {
                    console.error('Cannot publish global without region');
                    return;
                }
                await publishGlobalMutation.mutateAsync(pageContent);
            } else {
                if (!pageId) {
                    console.error('Cannot publish page without pageId');
                    return;
                }
                await publishPageMutation.mutateAsync({
                    content: pageContent,
                    changeDescription,
                });
            }
        },
        [isGlobal, pageId, region, publishPageMutation, publishGlobalMutation],
    );

    // Create page handler
    const createPage = useCallback(
        async (input: { name: string; slug: string; description?: string }) => {
            const result = await createMutation.mutateAsync(input);
            void queryClient.invalidateQueries({ queryKey: ['pages'] });
            navigate({ to: `/dashboard/builder/$id`, params: { id: result.createPage.id } });
        },
        [createMutation],
    );

    const changePage = useCallback(
        async (pageId: string) => {
            await navigate({ to: `/dashboard/builder/$id`, params: { id: pageId } });
        },
        [navigate],
    );

    const updateTheme = useCallback(
        async (input: { id: string; value: string }) => {
            await themeUpdateMutation.mutateAsync(input);
        },
        [themeUpdateMutation],
    );

    // Determine loading state based on whether it's a page or global
    const isLoading = isGlobal ? isGlobalLoading : isPageLoading;
    const refetch = isGlobal ? refetchGlobal : refetchPage;

    return (
        <BuilderContext.Provider
            value={{
                // Data
                page: isGlobal ? null : (pageData?.page ?? null),
                region: isGlobal ? region : undefined,
                theme: isGlobal ? undefined : pageData?.theme,
                isLoading: isLoading || !isContentLoaded,
                mode,
                content,
                isGlobal,

                // Actions
                changeMode,
                save,
                publish,
                createPage,
                changePage,
                refresh: refetch,
                updateTheme,
                getPageContent,

                // States
                isSaving: isGlobal ? saveGlobalDraftMutation.isPending : savePageDraftMutation.isPending,
                isPublishing: isGlobal ? publishGlobalMutation.isPending : publishPageMutation.isPending,
                isCreating: createMutation.isPending,
            }}
        >
            {children}
        </BuilderContext.Provider>
    );
}

export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (!context) throw new Error('Builder Context should be used inside a builder provider');
    return context;
};
