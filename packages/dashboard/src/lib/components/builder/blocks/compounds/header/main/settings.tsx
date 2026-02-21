import { useNode } from '@craftjs/core';
import { useState } from 'react';

import {
    ColorInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '../../../../common/index.js';

import { HeaderProps, LinkItem, LinkType } from '@/builder-blocks/compounds/header/index.js';
import { getPagesQuery } from '@/vdb/components/builder/builder.graphql.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';

const Tabs = [
    { id: 'layout', label: 'Layout' },
    { id: 'logo', label: 'Logo' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'cta', label: 'CTA' },
    { id: 'style', label: 'Style' },
];

const LayoutOptions = [
    { value: 'left', label: 'Left aligned' },
    { value: 'center', label: 'Centered' },
    { value: 'split', label: 'Split (Logo | Nav | CTA)' },
];

const HeightOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'tall', label: 'Tall' },
];

const CTAStyleOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'outline', label: 'Outline' },
];

export function HeaderSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    const addLink = () => {
        setProp((p: HeaderProps) => {
            const newLink: LinkItem = {
                id: Date.now().toString(),
                label: 'New Link',
                type: 'internal',
                url: '/',
            };
            p.links = [...(p.links || []), newLink];
        });
    };

    const updateLink = (index: number, field: keyof LinkItem, value: any) => {
        setProp((p: HeaderProps) => {
            const links = [...(p.links || [])];
            links[index] = { ...links[index], [field]: value };
            p.links = links;
        });
    };

    const removeLink = (index: number) => {
        setProp((p: HeaderProps) => {
            p.links = (p.links || []).filter((_, i) => i !== index);
        });
    };

    return (
        <SettingsTabs tabs={Tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout"
                        value={props.layout || 'split'}
                        onChange={val => setProp((p: HeaderProps) => (p.layout = val as any))}
                        options={LayoutOptions}
                    />

                    <SelectInput
                        label="Height"
                        value={props.height || 'normal'}
                        onChange={val => setProp((p: HeaderProps) => (p.height = val as any))}
                        options={HeightOptions}
                    />

                    <ToggleInput
                        label="Sticky Header"
                        value={props.sticky ?? false}
                        onChange={val => setProp((p: HeaderProps) => (p.sticky = val))}
                    />

                    <ToggleInput
                        label="Transparent Background"
                        value={props.transparent ?? false}
                        onChange={val => setProp((p: HeaderProps) => (p.transparent = val))}
                    />
                </div>
            )}

            {activeTab === 'logo' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Logo"
                        value={props.showLogo ?? true}
                        onChange={val => setProp((p: HeaderProps) => (p.showLogo = val))}
                    />

                    {props.showLogo && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded space-y-2">
                            <p>
                                The store name and logo are managed in your{' '}
                                <strong className="text-foreground">Store Settings</strong>.
                            </p>
                            <p className="text-xs">
                                Open the <strong>Settings</strong> tab in the left sidebar to update
                                your brand name and logo.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'navigation' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Navigation"
                        value={props.showNavigation ?? true}
                        onChange={val => setProp((p: HeaderProps) => (p.showNavigation = val))}
                    />

                    {props.showNavigation && (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Navigation Links</label>
                                <button
                                    onClick={addLink}
                                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    + Add Link
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(props.links || []).map((link: LinkItem, index: number) => (
                                    <div key={link.id} className="p-3 border rounded-md space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Link {index + 1}</span>
                                            <button
                                                onClick={() => removeLink(index)}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <Select
                                            defaultValue={link.type}
                                            onValueChange={val => updateLink(index, 'type', val)}
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
                                            setLabel={val => updateLink(index, 'label', val)}
                                            setValue={val => updateLink(index, 'url', val)}
                                            label={link.label}
                                            value={link.url}
                                        />
                                    </div>
                                ))}
                            </div>

                            {(!props.links || props.links.length === 0) && (
                                <div className="text-xs text-muted-foreground text-center p-4 border border-dashed rounded">
                                    No links added yet. Click "+ Add Link" to get started.
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'cta' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Cart Icon"
                        value={props.showCart ?? true}
                        onChange={val => setProp((p: HeaderProps) => (p.showCart = val))}
                    />

                    <ToggleInput
                        label="Show CTA Button"
                        value={props.showCTA ?? true}
                        onChange={val => setProp((p: HeaderProps) => (p.showCTA = val))}
                    />

                    {props.showCTA && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={props.ctaText || 'Get Started'}
                                    onChange={e => setProp((p: HeaderProps) => (p.ctaText = e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>

                            <SelectInput
                                label="Button Style"
                                value={props.ctaStyle || 'primary'}
                                onChange={val => setProp((p: HeaderProps) => (p.ctaStyle = val as any))}
                                options={CTAStyleOptions}
                            />
                        </>
                    )}
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-4">
                    <ColorInput
                        label="Background Color"
                        value={props.backgroundColor || '#ffffff'}
                        onChange={val => setProp((p: HeaderProps) => (p.backgroundColor = val))}
                    />

                    <ColorInput
                        label="Text Color"
                        value={props.textColor || '#000000'}
                        onChange={val => setProp((p: HeaderProps) => (p.textColor = val))}
                    />

                    <ToggleInput
                        label="Drop Shadow"
                        value={props.shadow ?? true}
                        onChange={val => setProp((p: HeaderProps) => (p.shadow = val))}
                    />

                    <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
                        💡 For transparent headers, the text color will be used for all elements
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}

type LinkSelectProps = {
    linkType: LinkType;
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
                        <SelectItem value={page.id}>{page.name}</SelectItem>
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
