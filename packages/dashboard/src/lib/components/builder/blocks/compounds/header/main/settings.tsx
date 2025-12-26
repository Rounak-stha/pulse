import { useNode } from '@craftjs/core';
import { useState } from 'react';

import {
    ColorInput,
    ImageUploadInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '../../../../common/index.js';

import { HeaderProps, LinkItem } from '@vendure/storefront-blocks/types';

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
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Logo Text</label>
                                <input
                                    type="text"
                                    value={props.logoText || 'Brand'}
                                    onChange={e => setProp((p: HeaderProps) => (p.logoText = e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>

                            <ImageUploadInput
                                label="Logo Image (optional)"
                                value={props.logoImage}
                                onChange={val => setProp((p: HeaderProps) => (p.logoImage = val))}
                            />

                            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
                                💡 If both text and image are provided, both will be displayed
                            </div>
                        </>
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

                                        <input
                                            type="text"
                                            placeholder="Label"
                                            value={link.label}
                                            onChange={e => updateLink(index, 'label', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        />

                                        <select
                                            value={link.type}
                                            onChange={e =>
                                                updateLink(
                                                    index,
                                                    'type',
                                                    e.target.value as 'internal' | 'external',
                                                )
                                            }
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="internal">Internal Page</option>
                                            <option value="external">External Link</option>
                                        </select>

                                        <input
                                            type="text"
                                            placeholder={
                                                link.type === 'internal' ? 'Page ID or path' : 'https://...'
                                            }
                                            value={link.url}
                                            onChange={e => updateLink(index, 'url', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-sm"
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
