// hooks/use-builder-page.ts
import {
    createPageMutation,
    getPageQuery,
    publishPageMutation,
    savePageDraftMutation,
} from '@/vdb/components/builder/buider.graphql.js';
import { useEditor } from '@craftjs/core';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import LZString from 'lz-string';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../graphql/api.js';

interface UseBuilderPageOptions {
    pageId?: string;
}

export function useBuilderPage(pageId: string) {
    const navigate = useNavigate();
    const { actions, query } = useEditor();
    const queryClient = useQueryClient();
    const [isContentLoaded, setIsContentLoaded] = useState(false);

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

    // Publish mutation
    const publishMutation = useMutation({
        mutationFn: () =>
            api.mutate(publishPageMutation, {
                input: { pageId: pageId! },
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

    // Load content into editor
    useEffect(() => {
        if (!isLoading) {
            const content = pageData?.page?.draftVersion?.content || pageData?.page?.draftVersion?.content;
            if (content) {
                try {
                    const decompressed = LZString.decompressFromBase64(content);
                    if (decompressed) {
                        actions.deserialize(decompressed);
                    }
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
    }, [pageData, isLoading, actions, pageId]);

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
                // theme: getCurrentTheme(), // TODO: Add theme
                changeDescription,
            });
        },
        [pageId, query, saveDraftMutation],
    );

    // Publish handler
    const publish = useCallback(async () => {
        if (!pageId) {
            console.error('Cannot publish without pageId');
            return;
        }

        await publishMutation.mutateAsync();
    }, [pageId, publishMutation]);

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

    return {
        // Data
        page: pageData?.page ?? null,
        isLoading: isLoading || !isContentLoaded,

        // Actions
        save,
        publish,
        createPage,
        changePage,
        refresh: refetch,

        // States
        isSaving: saveDraftMutation.isPending,
        isPublishing: publishMutation.isPending,
        isCreating: createMutation.isPending,
    };
}

export function getBuilderPageQueryOptions(pageId: string) {
    return queryOptions({
        queryKey: ['builder-page', pageId],
        queryFn: () => api.query(getPageQuery, { id: pageId }),
        enabled: !!pageId,
    });
}
