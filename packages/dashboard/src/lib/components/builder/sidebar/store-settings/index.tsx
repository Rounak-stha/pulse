import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ImageUploadInput } from '@/vdb/components/builder/common/settings/image-input.jsx';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';
import { getActiveShopQuery } from '@/vdb/components/builder/builder.graphql.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';

const updateShopMutation = graphql(`
    mutation UpdateShop($input: UpdateShopInput!) {
        updateShop(input: $input) {
            ... on Shop {
                id
                name
                code
                domain
                description
                logo
                seoTitle
                seoDescription
            }
        }
    }
`);

export function StoreSettingsPanel() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['active-shop'],
        queryFn: () => api.query(getActiveShopQuery),
    });

    const shop = data?.activeShop;

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        logo: '',
        seoTitle: '',
        seoDescription: '',
    });

    useEffect(() => {
        if (shop) {
            setFormState({
                name: shop.name ?? '',
                description: shop.description ?? '',
                logo: shop.logo ?? '',
                seoTitle: shop.seoTitle ?? '',
                seoDescription: shop.seoDescription ?? '',
            });
        }
    }, [shop]);

    const mutation = useMutation({
        mutationFn: () =>
            api.mutate(updateShopMutation, {
                input: {
                    id: shop!.id,
                    name: formState.name || undefined,
                    description: formState.description || undefined,
                    logo: formState.logo || undefined,
                    seoTitle: formState.seoTitle || undefined,
                    seoDescription: formState.seoDescription || undefined,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-shop'] });
            toast.success('Store settings updated');
        },
        onError: () => {
            toast.error('Failed to update store settings');
        },
    });

    const updateField = useCallback(
        <K extends keyof typeof formState>(key: K, value: (typeof formState)[K]) => {
            setFormState(prev => ({ ...prev, [key]: value }));
        },
        [],
    );

    const handleSave = useCallback(() => {
        if (shop?.id) {
            mutation.mutate();
        }
    }, [shop?.id, mutation]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-foreground">Store Settings</h3>
                <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">Store Settings</h3>
                <Button size="xs" onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs">Store Name</Label>
                    <Input
                        value={formState.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="My Store"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                        value={formState.description}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="A brief description of your store"
                        rows={3}
                        className="resize-none"
                    />
                </div>

                <ImageUploadInput
                    label="Store Logo"
                    value={formState.logo}
                    onChange={value => updateField('logo', value)}
                />

                <Separator />

                <div>
                    <Label className="text-xs text-muted-foreground">SEO</Label>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs">SEO Title</Label>
                    <Input
                        value={formState.seoTitle}
                        onChange={e => updateField('seoTitle', e.target.value)}
                        placeholder="Page title for search engines"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs">SEO Description</Label>
                    <Textarea
                        value={formState.seoDescription}
                        onChange={e => updateField('seoDescription', e.target.value)}
                        placeholder="Meta description for search engines"
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">
                        Recommended: 150-160 characters
                    </p>
                </div>
            </div>
        </div>
    );
}
