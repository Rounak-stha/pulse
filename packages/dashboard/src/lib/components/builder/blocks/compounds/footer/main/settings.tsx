import { useNode } from '@craftjs/core';
import { useState } from 'react';

import {
    ColorInput,
    ImageUploadInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '../../../../common/index.js';

import {
    FooterColumn,
    FooterLink,
    FooterProps,
    SocialLink,
} from '@/builder-blocks/compounds/footer/index.js';
import { getPagesQuery } from '@/vdb/components/builder/buider.graphql.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';

const Tabs = [
    { id: 'layout', label: 'Layout' },
    { id: 'logo', label: 'Logo' },
    { id: 'columns', label: 'Columns' },
    { id: 'social', label: 'Social' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'style', label: 'Style' },
];

const LayoutOptions = [
    { value: 'wide', label: 'Wide' },
    { value: 'stacked', label: 'Stacked' },
    { value: 'minimal', label: 'Minimal' },
];

const SocialPlatforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'github', label: 'GitHub' },
];

export function FooterSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    // Column Management
    const addColumn = () => {
        setProp((p: FooterProps) => {
            const newColumn: FooterColumn = {
                id: Date.now().toString(),
                title: 'New Column',
                links: [],
            };
            p.columns = [...(p.columns || []), newColumn];
        });
    };

    const updateColumn = (index: number, field: keyof FooterColumn, value: any) => {
        setProp((p: FooterProps) => {
            const columns = [...(p.columns || [])];
            columns[index] = { ...columns[index], [field]: value };
            p.columns = columns;
        });
    };

    const removeColumn = (index: number) => {
        setProp((p: FooterProps) => {
            p.columns = (p.columns || []).filter((_, i) => i !== index);
        });
    };

    // Link Management within Columns
    const addLinkToColumn = (columnIndex: number) => {
        setProp((p: FooterProps) => {
            const columns = [...(p.columns || [])];
            const newLink: FooterLink = {
                id: Date.now().toString(),
                label: 'New Link',
                type: 'internal',
                url: '/',
            };
            columns[columnIndex] = {
                ...columns[columnIndex],
                links: [...(columns[columnIndex].links || []), newLink],
            };
            p.columns = columns;
        });
    };

    const updateColumnLink = (
        columnIndex: number,
        linkIndex: number,
        field: keyof FooterLink,
        value: any,
    ) => {
        setProp((p: FooterProps) => {
            const columns = [...(p.columns || [])];
            const links = [...columns[columnIndex].links];
            links[linkIndex] = { ...links[linkIndex], [field]: value };
            columns[columnIndex] = { ...columns[columnIndex], links };
            p.columns = columns;
        });
    };

    const removeColumnLink = (columnIndex: number, linkIndex: number) => {
        setProp((p: FooterProps) => {
            const columns = [...(p.columns || [])];
            columns[columnIndex] = {
                ...columns[columnIndex],
                links: columns[columnIndex].links.filter((_, i) => i !== linkIndex),
            };
            p.columns = columns;
        });
    };

    // Social Link Management
    const addSocialLink = () => {
        setProp((p: FooterProps) => {
            const newSocial: SocialLink = {
                id: Date.now().toString(),
                platform: 'facebook',
                url: 'https://facebook.com',
            };
            p.socialLinks = [...(p.socialLinks || []), newSocial];
        });
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
        setProp((p: FooterProps) => {
            const socialLinks = [...(p.socialLinks || [])];
            socialLinks[index] = { ...socialLinks[index], [field]: value };
            p.socialLinks = socialLinks;
        });
    };

    const removeSocialLink = (index: number) => {
        setProp((p: FooterProps) => {
            p.socialLinks = (p.socialLinks || []).filter((_, i) => i !== index);
        });
    };

    return (
        <SettingsTabs tabs={Tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout"
                        value={props.layout || 'wide'}
                        onChange={val => setProp((p: FooterProps) => (p.layout = val as any))}
                        options={LayoutOptions}
                    />

                    <ToggleInput
                        label="Show Copyright"
                        value={props.showCopyright ?? true}
                        onChange={val => setProp((p: FooterProps) => (p.showCopyright = val))}
                    />

                    {props.showCopyright && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Copyright Text</label>
                            <input
                                type="text"
                                value={props.copyrightText || '© 2024 Brand. All rights reserved.'}
                                onChange={e =>
                                    setProp((p: FooterProps) => (p.copyrightText = e.target.value))
                                }
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'logo' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Logo"
                        value={props.showLogo ?? true}
                        onChange={val => setProp((p: FooterProps) => (p.showLogo = val))}
                    />

                    {props.showLogo && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Logo Text</label>
                                <input
                                    type="text"
                                    value={props.logoText || 'Brand'}
                                    onChange={e => setProp((p: FooterProps) => (p.logoText = e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>

                            <ImageUploadInput
                                label="Logo Image (optional)"
                                value={props.logoImage}
                                onChange={val => setProp((p: FooterProps) => (p.logoImage = val))}
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Tagline</label>
                                <textarea
                                    value={props.tagline || 'Building amazing experiences'}
                                    onChange={e => setProp((p: FooterProps) => (p.tagline = e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    rows={2}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'columns' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Columns"
                        value={props.showColumns ?? true}
                        onChange={val => setProp((p: FooterProps) => (p.showColumns = val))}
                    />

                    {props.showColumns && (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Footer Columns</label>
                                <button
                                    onClick={addColumn}
                                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    + Add Column
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(props.columns || []).map((column: FooterColumn, columnIndex: number) => (
                                    <div key={column.id} className="p-3 border rounded-md space-y-3">
                                        <div className="flex items-center justify-between">
                                            <input
                                                type="text"
                                                value={column.title}
                                                onChange={e =>
                                                    updateColumn(columnIndex, 'title', e.target.value)
                                                }
                                                className="font-medium text-sm px-2 py-1 border rounded flex-1 mr-2"
                                                placeholder="Column Title"
                                            />
                                            <button
                                                onClick={() => removeColumn(columnIndex)}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="pl-3 border-l-2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-muted-foreground">
                                                    Links
                                                </label>
                                                <button
                                                    onClick={() => addLinkToColumn(columnIndex)}
                                                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    + Add Link
                                                </button>
                                            </div>

                                            {column.links.map((link: FooterLink, linkIndex: number) => (
                                                <div
                                                    key={link.id}
                                                    className="p-2 bg-muted/50 rounded space-y-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium">
                                                            Link {linkIndex + 1}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                removeColumnLink(columnIndex, linkIndex)
                                                            }
                                                            className="text-xs text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <Select
                                                        defaultValue={link.type}
                                                        onValueChange={val =>
                                                            updateColumnLink(
                                                                columnIndex,
                                                                linkIndex,
                                                                'type',
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select link type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="internal">Internal</SelectItem>
                                                            <SelectItem value="external">External</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <LinkSelect
                                                        linkType={link.type}
                                                        setLabel={val =>
                                                            updateColumnLink(
                                                                columnIndex,
                                                                linkIndex,
                                                                'label',
                                                                val,
                                                            )
                                                        }
                                                        setValue={val =>
                                                            updateColumnLink(
                                                                columnIndex,
                                                                linkIndex,
                                                                'url',
                                                                val,
                                                            )
                                                        }
                                                        label={link.label}
                                                        value={link.url}
                                                    />
                                                </div>
                                            ))}

                                            {column.links.length === 0 && (
                                                <div className="text-xs text-muted-foreground text-center p-2 border border-dashed rounded">
                                                    No links yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(!props.columns || props.columns.length === 0) && (
                                <div className="text-xs text-muted-foreground text-center p-4 border border-dashed rounded">
                                    No columns added yet. Click "+ Add Column" to get started.
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'social' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Social Links"
                        value={props.showSocial ?? true}
                        onChange={val => setProp((p: FooterProps) => (p.showSocial = val))}
                    />

                    {props.showSocial && (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Social Links</label>
                                <button
                                    onClick={addSocialLink}
                                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    + Add Social
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(props.socialLinks || []).map((social: SocialLink, index: number) => (
                                    <div key={social.id} className="p-3 border rounded-md space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Social {index + 1}</span>
                                            <button
                                                onClick={() => removeSocialLink(index)}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <Select
                                            defaultValue={social.platform}
                                            onValueChange={val => updateSocialLink(index, 'platform', val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SocialPlatforms.map(platform => (
                                                    <SelectItem key={platform.value} value={platform.value}>
                                                        {platform.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="text"
                                            placeholder="https://..."
                                            value={social.url}
                                            onChange={e => updateSocialLink(index, 'url', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {(!props.socialLinks || props.socialLinks.length === 0) && (
                                <div className="text-xs text-muted-foreground text-center p-4 border border-dashed rounded">
                                    No social links added yet. Click "+ Add Social" to get started.
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'newsletter' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Newsletter"
                        value={props.showNewsletter ?? true}
                        onChange={val => setProp((p: FooterProps) => (p.showNewsletter = val))}
                    />

                    {props.showNewsletter && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Newsletter Title</label>
                                <input
                                    type="text"
                                    value={props.newsletterTitle || 'Subscribe to our newsletter'}
                                    onChange={e =>
                                        setProp((p: FooterProps) => (p.newsletterTitle = e.target.value))
                                    }
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Input Placeholder</label>
                                <input
                                    type="text"
                                    value={props.newsletterPlaceholder || 'Enter your email'}
                                    onChange={e =>
                                        setProp(
                                            (p: FooterProps) => (p.newsletterPlaceholder = e.target.value),
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-4">
                    <ColorInput
                        label="Background Color"
                        value={props.backgroundColor || '#0f172a'}
                        onChange={val => setProp((p: FooterProps) => (p.backgroundColor = val))}
                    />

                    <ColorInput
                        label="Text Color"
                        value={props.textColor || '#e2e8f0'}
                        onChange={val => setProp((p: FooterProps) => (p.textColor = val))}
                    />

                    <ColorInput
                        label="Accent Color"
                        value={props.accentColor || '#3b82f6'}
                        onChange={val => setProp((p: FooterProps) => (p.accentColor = val))}
                    />

                    <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
                        💡 Accent color is used for buttons and hover effects
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}

type LinkSelectProps = {
    linkType: 'internal' | 'external';
    label: string;
    value: string;
    setLabel: (val: string) => void;
    setValue: (val: string) => void;
};

function LinkSelect({ linkType, setLabel, setValue, label, value }: LinkSelectProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['pages'],
        queryFn: () => api.query(getPagesQuery, { options: { take: 20 } }),
    });

    const pages = data?.pages.items || [];

    const selectInternalLink = (id: string) => {
        const page = pages.find(page => page.id == id);

        if (!page) return;

        setLabel(page.name);
        setValue(page.slug);
    };

    const defaultInternalId = linkType == 'internal' ? pages.find(page => page.slug == value)?.id || '' : '';

    if (linkType == 'internal') {
        return (
            <Select defaultValue={defaultInternalId} onValueChange={selectInternalLink}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Page" />
                </SelectTrigger>
                <SelectContent>
                    {isLoading && (
                        <SelectItem value="disabled" disabled>
                            Loading...
                        </SelectItem>
                    )}
                    {pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                            {page.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <>
            <Input type="text" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
            <Input
                type="text"
                placeholder="https://..."
                value={value}
                onChange={e => setValue(e.target.value)}
            />
        </>
    );
}
