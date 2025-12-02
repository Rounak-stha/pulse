import {
    createPageMutation,
    getPageQuery,
    publishPageMutation,
    savePageDraftMutation,
    updateThemeMutation,
} from '@/vdb/components/builder/buider.graphql.js';
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
     * Page Information
     */
    page: ResultOf<typeof getPageQuery>['page'];
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
     * The function to save the page.
     */
    save: (changeDescription?: string) => Promise<void>;
    /**
     * @description
     * The function to publish the page.
     */
    publish: () => Promise<void>;
    /**
     * @description
     * The function to create a page.
     */
    createPage: (input: { name: string; slug: string; description?: string }) => Promise<void>;
    /**
     * @description
     * The function to create a page.
     */
    changePage: (pageId: string) => Promise<void>;
    /**
     * @description
     * function to refresh the page
     */
    refresh: ReturnType<typeof useQuery>['refetch'];
    /**
     * @description
     * The function to update Shop theme.
     */
    updateTheme: (input: { id: string; value: string }) => Promise<void>;
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
}

export function getBuilderPageQueryOptions(pageId: string) {
    return queryOptions({
        queryKey: ['builder-page', pageId],
        queryFn: () => api.query(getPageQuery, { id: pageId }),
        enabled: !!pageId,
    });
}

export const BuilderContext = createContext<BuilderContext | null>(null);

export function BuilderProvider({
    pageId,
    children,
}: Readonly<{ pageId?: string; children: React.ReactNode }>) {
    const navigate = useNavigate();
    const { actions, query } = useEditor();
    const queryClient = useQueryClient();
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const [mode, setMode] = useState<Mode>('edit');
    const [content, setContent] = useState<string>();

    // Fetch draft version
    const { data: pageData, isLoading, refetch } = useQuery(getBuilderPageQueryOptions(pageId ?? ''));
    // Save draft mutation
    const saveDraftMutation = useMutation({
        mutationFn: (input: { content: string; theme?: string; changeDescription?: string }) =>
            api.mutate(savePageDraftMutation, {
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

    const changeMode = (mode: Mode) => setMode(mode);

    // Publish mutation
    const publishMutation = useMutation({
        mutationFn: (input: { content: string; theme?: string; changeDescription?: string }) =>
            api.mutate(publishPageMutation, {
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

    // Create page mutation
    const createMutation = useMutation({
        mutationFn: (input: { name: string; slug: string; description?: string }) =>
            api.mutate(createPageMutation, { input }),
        onSuccess: data => {
            console.log({ data });
            void queryClient.invalidateQueries({ queryKey: ['pages'] });
            navigate({ to: `../$id`, params: { id: data.createPage.id } });
        },
    });

    const themeUpdateMutation = useMutation({
        mutationFn: (input: { id: string; value: string }) =>
            api.mutate(updateThemeMutation, {
                input,
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['shop-theme'] });
            toast.success('Theme updated');
        },
        onError: () => toast.error('Failed to update theme'),
    });

    // Load content into editor
    useEffect(() => {
        if (!isLoading) {
            const content =
                pageData?.page?.draftVersion?.content || pageData?.page?.publishedVersion?.content;
            const theme = pageData?.theme.value;
            if (theme) {
                setThemeOnCanvas(theme);
            }
            if (content) {
                try {
                    actions.deserialize(content);
                    /* const decompressed = LZString.decompressFromBase64(content);
                    if (decompressed) {
                        actions.deserialize(decompressed);
                    } */
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
    }, [pageData, isLoading, pageId]);

    // Reset loaded state when pageId changes
    useEffect(() => {
        setIsContentLoaded(false);
    }, [pageId]);

    // Save handler
    const save = useCallback(
        async (changeDescription?: string) => {
            if (!pageId) {
                console.error('Cannot save without pageId');
                return;
            }

            const json = query.serialize();
            const compressed = LZString.compressToBase64(json);

            await saveDraftMutation.mutateAsync({
                content: json,
                changeDescription,
            });
        },
        [pageId, query, saveDraftMutation],
    );

    // Publish handler
    const publish = useCallback(
        async (changeDescription?: string) => {
            if (!pageId) {
                console.error('Cannot publish without pageId');
                return;
            }

            const json = query.serialize();
            const compressed = LZString.compressToBase64(json);

            await publishMutation.mutateAsync({
                content: json,
                changeDescription,
            });
        },
        [pageId, publishMutation],
    );

    // Create page handler
    const createPage = useCallback(
        async (input: { name: string; slug: string; description?: string }) => {
            const result = await createMutation.mutateAsync(input);
            await navigate({ to: `../$id`, params: { id: pageId } });
        },
        [createPageMutation],
    );

    const changePage = useCallback(
        async (pageId: string) => {
            await navigate({ to: `../$id`, params: { id: pageId } });
        },
        [navigate],
    );

    const updateTheme = useCallback(
        async (input: { id: string; value: string }) => {
            await themeUpdateMutation.mutateAsync(input);
        },
        [themeUpdateMutation],
    );

    return (
        <BuilderContext.Provider
            value={{
                // Data
                page: pageData?.page ?? null,
                theme: pageData?.theme,
                isLoading: isLoading || !isContentLoaded,
                mode,
                content,

                // Actions
                changeMode,
                save,
                publish,
                createPage,
                changePage,
                refresh: refetch,
                updateTheme,

                // States
                isSaving: saveDraftMutation.isPending,
                isPublishing: publishMutation.isPending,
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
