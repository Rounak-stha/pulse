import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ColorInput, SelectInput, SettingsTabs, TextInput, ToggleInput } from '@/common/index.js';

import { ColorMode, HeadlineProps, HeadlinePurpose, SizeOption } from './types.js';

export function HeadlineSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('content');

    return (
        <SettingsTabs
            tabs={[
                { id: 'content', label: 'Content' },
                { id: 'style', label: 'Style' },
                { id: 'colors', label: 'Colors' },
                { id: 'effects', label: 'Effects' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'content' && (
                <div className="space-y-4">
                    <TextInput
                        label="Headline Text"
                        value={props.text}
                        onChange={val => setProp((p: HeadlineProps) => (p.text = val))}
                        rows={3}
                    />

                    <SelectInput
                        label="Headline Purpose"
                        value={props.purpose}
                        onChange={val => setProp((p: HeadlineProps) => (p.purpose = val as HeadlinePurpose))}
                        options={[
                            { value: 'page-title', label: '📄 Main Page Title (Largest)' },
                            { value: 'section-title', label: '📑 Section Title' },
                            { value: 'subsection', label: '📋 Subsection Title' },
                            { value: 'small-heading', label: '📝 Small Heading' },
                            { value: 'text', label: '📃 Regular Text Block' },
                            { value: 'inline', label: '✏️ Inline Text' },
                        ]}
                    />

                    <ToggleInput
                        label="Auto-adjust size"
                        value={props.autoSize ?? true}
                        onChange={val => setProp((p: HeadlineProps) => (p.autoSize = val))}
                        // description="Automatically set the perfect size based on purpose"
                    />

                    {!props.autoSize && (
                        <SelectInput
                            label="Text Size"
                            value={props.size || 'large'}
                            onChange={val => setProp((p: HeadlineProps) => (p.size = val as SizeOption))}
                            options={[
                                { value: 'small', label: 'Small' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'large', label: 'Large' },
                                { value: 'xlarge', label: 'Extra Large' },
                            ]}
                        />
                    )}

                    <ToggleInput
                        label="Limit width for readability"
                        value={props.maxWidth || false}
                        onChange={val => setProp((p: HeadlineProps) => (p.maxWidth = val))}
                        // description="Keeps text from stretching too wide"
                    />
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Font Weight"
                        value={props.weight}
                        onChange={val => setProp((p: HeadlineProps) => (p.weight = val as any))}
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'semibold', label: 'Semi Bold' },
                            { value: 'bold', label: 'Bold' },
                            { value: 'extrabold', label: 'Extra Bold' },
                            { value: 'black', label: 'Heavy' },
                        ]}
                    />

                    <SelectInput
                        label="Text Position"
                        value={props.align}
                        onChange={val => setProp((p: HeadlineProps) => (p.align = val as any))}
                        options={[
                            { value: 'left', label: '⬅️ Left' },
                            { value: 'center', label: '↔️ Center' },
                            { value: 'right', label: '➡️ Right' },
                            { value: 'justify', label: '↔️ Justified' },
                        ]}
                    />

                    <SelectInput
                        label="Letter Casing"
                        value={props.transform}
                        onChange={val => setProp((p: HeadlineProps) => (p.transform = val as any))}
                        options={[
                            { value: 'none', label: 'Normal Text' },
                            { value: 'uppercase', label: 'ALL CAPS' },
                            { value: 'lowercase', label: 'all lowercase' },
                            { value: 'capitalize', label: 'Capitalize Each Word' },
                        ]}
                    />

                    <SelectInput
                        label="Letter Spacing"
                        value={props.spacing}
                        onChange={val => setProp((p: HeadlineProps) => (p.spacing = val as any))}
                        options={[
                            { value: 'tight', label: 'Tight (Close together)' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'wide', label: 'Wide' },
                            { value: 'wider', label: 'Wider' },
                            { value: 'widest', label: 'Widest (Very spaced)' },
                        ]}
                    />

                    <SelectInput
                        label="Line Spacing"
                        value={props.lineHeight}
                        onChange={val => setProp((p: HeadlineProps) => (p.lineHeight = val as any))}
                        options={[
                            { value: 'none', label: 'None (Compact)' },
                            { value: 'tight', label: 'Tight' },
                            { value: 'snug', label: 'Snug' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'relaxed', label: 'Relaxed' },
                            { value: 'loose', label: 'Loose (Spacious)' },
                        ]}
                    />

                    <SelectInput
                        label="Text Decoration"
                        value={props.decoration}
                        onChange={val => setProp((p: HeadlineProps) => (p.decoration = val as any))}
                        options={[
                            { value: 'none', label: 'None' },
                            { value: 'underline', label: 'Underline' },
                            { value: 'line-through', label: 'Strikethrough' },
                        ]}
                    />
                </div>
            )}

            {activeTab === 'colors' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Color Type"
                        value={props.colorMode}
                        onChange={val => setProp((p: HeadlineProps) => (p.colorMode = val as ColorMode))}
                        options={[
                            { value: 'theme', label: '🎨 Theme Colors (Matches your brand)' },
                            { value: 'custom', label: '🖌️ Custom Color' },
                        ]}
                    />

                    {props.colorMode === 'theme' && (
                        <SelectInput
                            label="Choose Theme Color"
                            value={props.themeColor}
                            onChange={val => setProp((p: HeadlineProps) => (p.themeColor = val as any))}
                            options={[
                                { value: 'foreground', label: 'Main Text Color' },
                                { value: 'primary', label: 'Primary Brand Color' },
                                { value: 'secondary', label: 'Secondary Color' },
                                { value: 'accent', label: 'Accent Color' },
                                { value: 'muted', label: 'Subtle/Muted' },
                                { value: 'destructive', label: 'Alert/Warning' },
                            ]}
                        />
                    )}

                    {props.colorMode === 'custom' && !props.gradient && (
                        <ColorInput
                            label="Text Color"
                            value={props.customColor || '#000000'}
                            onChange={val => setProp((p: HeadlineProps) => (p.customColor = val))}
                        />
                    )}

                    <div className="border-t pt-4">
                        <ToggleInput
                            label="Use Gradient"
                            value={props.gradient || false}
                            onChange={val => setProp((p: HeadlineProps) => (p.gradient = val))}
                            // description="Create colorful gradient text"
                        />

                        {props.gradient && (
                            <div className="space-y-3 mt-3">
                                <ColorInput
                                    label="Start Color"
                                    value={props.gradientFrom || '#000000'}
                                    onChange={val => setProp((p: HeadlineProps) => (p.gradientFrom = val))}
                                />
                                <ColorInput
                                    label="End Color"
                                    value={props.gradientTo || '#666666'}
                                    onChange={val => setProp((p: HeadlineProps) => (p.gradientTo = val))}
                                />
                                <SelectInput
                                    label="Gradient Direction"
                                    value={props.gradientDirection || 'to-right'}
                                    onChange={val =>
                                        setProp((p: HeadlineProps) => (p.gradientDirection = val as any))
                                    }
                                    options={[
                                        { value: 'to-right', label: '→ Left to Right' },
                                        { value: 'to-left', label: '← Right to Left' },
                                        { value: 'to-bottom', label: '↓ Top to Bottom' },
                                        { value: 'to-top', label: '↑ Bottom to Top' },
                                        { value: 'diagonal', label: '↘ Diagonal' },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'effects' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Add Shadow"
                        value={props.shadow || false}
                        onChange={val => setProp((p: HeadlineProps) => (p.shadow = val))}
                        // description="Adds depth to your text"
                    />

                    {props.shadow && (
                        <>
                            <SelectInput
                                label="Shadow Strength"
                                value={props.shadowIntensity || 'medium'}
                                onChange={val =>
                                    setProp((p: HeadlineProps) => (p.shadowIntensity = val as any))
                                }
                                options={[
                                    { value: 'subtle', label: 'Subtle' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'strong', label: 'Strong' },
                                ]}
                            />
                            <ColorInput
                                label="Shadow Color"
                                value={props.shadowColor || '#00000040'}
                                onChange={val => setProp((p: HeadlineProps) => (p.shadowColor = val))}
                            />
                        </>
                    )}

                    <ToggleInput
                        label="Animate on scroll"
                        value={props.animateOnView || false}
                        onChange={val => setProp((p: HeadlineProps) => (p.animateOnView = val))}
                        // description="Text fades in when scrolled into view"
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
