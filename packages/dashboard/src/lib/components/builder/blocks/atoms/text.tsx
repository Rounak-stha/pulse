// components/text.tsx

import { cn } from '@/vdb/lib/utils.js';
import { useNode } from '@craftjs/core';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import {
    ColorInput,
    SelectInput,
    SettingsTabs,
    TextInput,
    ToggleInput,
} from '../sidebar/blocks/setting-inputs.js';

const textVariants = cva('transition-all duration-300', {
    variants: {
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        },
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        lineHeight: {
            tight: 'leading-tight',
            snug: 'leading-snug',
            normal: 'leading-normal',
            relaxed: 'leading-relaxed',
            loose: 'leading-loose',
        },
    },
    defaultVariants: {
        size: 'base',
        weight: 'normal',
        align: 'left',
        lineHeight: 'relaxed',
    },
});

type ColorMode = 'theme' | 'custom';
type TextPurpose = 'body' | 'description' | 'caption' | 'quote';

interface TextProps extends VariantProps<typeof textVariants> {
    content: string;
    purpose: TextPurpose;
    colorMode: ColorMode;
    themeColor?: 'foreground' | 'primary' | 'secondary' | 'accent' | 'muted';
    customColor?: string;
    opacity?: number;
    maxWidth?: boolean;
    indent?: boolean;
    italic?: boolean;
    underline?: boolean;
    animateOnView?: boolean;
    className?: string;
}

export const Text: React.FC<TextProps> = ({
    content,
    purpose = 'body',
    size = 'base',
    weight = 'normal',
    align = 'left',
    lineHeight = 'relaxed',
    colorMode = 'theme',
    themeColor = 'foreground',
    customColor = '#000000',
    opacity = 100,
    maxWidth = true,
    indent = false,
    italic = false,
    underline = false,
    animateOnView = false,
    className,
}) => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    // Get theme color class
    const getThemeColorClass = () => {
        if (colorMode !== 'theme') return '';

        const colorMap = {
            foreground: 'text-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            accent: 'text-accent',
            muted: 'text-muted-foreground',
        };

        return colorMap[themeColor];
    };

    // Purpose-based styling
    const getPurposeStyles = () => {
        const purposeMap = {
            body: '',
            description: 'text-muted-foreground',
            caption: 'text-sm text-muted-foreground',
            quote: 'border-l-4 border-primary pl-4 italic',
        };
        return purposeMap[purpose];
    };

    // Custom styles
    const getCustomStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if (colorMode === 'custom' && customColor) {
            styles.color = customColor;
        }

        if (opacity < 100) {
            styles.opacity = opacity / 100;
        }

        return styles;
    };

    return (
        <p
            ref={(ref: any) => {
                connect(drag(ref));
            }}
            className={cn(
                textVariants({ size, weight, align, lineHeight }),
                colorMode === 'theme' && getThemeColorClass(),
                getPurposeStyles(),
                maxWidth && 'max-w-prose',
                indent &&
                    'first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left',
                italic && 'italic',
                underline && 'underline underline-offset-2',
                animateOnView && 'opacity-0 translate-y-4 transition-all duration-700',
                selected && 'ring-2 ring-blue-500 ring-offset-2',
                className,
            )}
            style={getCustomStyles()}
            data-animate={animateOnView ? 'true' : undefined}
        >
            {content}
        </p>
    );
};

function TextSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = React.useState('content');

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
                        label="Text Content"
                        value={props.content}
                        onChange={val => setProp((p: TextProps) => (p.content = val))}
                        rows={6}
                    />

                    <SelectInput
                        label="Text Purpose"
                        value={props.purpose}
                        onChange={val => setProp((p: TextProps) => (p.purpose = val as TextPurpose))}
                        options={[
                            { value: 'body', label: '📄 Body Text (Regular content)' },
                            { value: 'description', label: '📝 Description (Subtle text)' },
                            { value: 'caption', label: '🏷️ Caption (Small label)' },
                            { value: 'quote', label: '💬 Quote (With border)' },
                        ]}
                    />

                    <ToggleInput
                        label="Limit width for readability"
                        value={props.maxWidth ?? true}
                        onChange={val => setProp((p: TextProps) => (p.maxWidth = val))}
                        // description="Keeps text at comfortable reading width"
                    />
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Text Size"
                        value={props.size}
                        onChange={val => setProp((p: TextProps) => (p.size = val as any))}
                        options={[
                            { value: 'xs', label: 'Extra Small' },
                            { value: 'sm', label: 'Small' },
                            { value: 'base', label: 'Normal' },
                            { value: 'lg', label: 'Large' },
                            { value: 'xl', label: 'Extra Large' },
                        ]}
                    />

                    <SelectInput
                        label="Font Weight"
                        value={props.weight}
                        onChange={val => setProp((p: TextProps) => (p.weight = val as any))}
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'semibold', label: 'Semi Bold' },
                            { value: 'bold', label: 'Bold' },
                        ]}
                    />

                    <SelectInput
                        label="Text Position"
                        value={props.align}
                        onChange={val => setProp((p: TextProps) => (p.align = val as any))}
                        options={[
                            { value: 'left', label: '⬅️ Left' },
                            { value: 'center', label: '↔️ Center' },
                            { value: 'right', label: '➡️ Right' },
                            { value: 'justify', label: '↔️ Justified (Full width)' },
                        ]}
                    />

                    <SelectInput
                        label="Line Spacing"
                        value={props.lineHeight}
                        onChange={val => setProp((p: TextProps) => (p.lineHeight = val as any))}
                        options={[
                            { value: 'tight', label: 'Tight (Compact)' },
                            { value: 'snug', label: 'Snug' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'relaxed', label: 'Relaxed (Comfortable)' },
                            { value: 'loose', label: 'Loose (Spacious)' },
                        ]}
                    />

                    <ToggleInput
                        label="Italic style"
                        value={props.italic || false}
                        onChange={val => setProp((p: TextProps) => (p.italic = val))}
                    />

                    <ToggleInput
                        label="Underline"
                        value={props.underline || false}
                        onChange={val => setProp((p: TextProps) => (p.underline = val))}
                    />

                    <ToggleInput
                        label="Fancy first letter"
                        value={props.indent || false}
                        onChange={val => setProp((p: TextProps) => (p.indent = val))}
                        // description="Makes the first letter large and bold"
                    />
                </div>
            )}

            {activeTab === 'colors' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Color Type"
                        value={props.colorMode}
                        onChange={val => setProp((p: TextProps) => (p.colorMode = val as ColorMode))}
                        options={[
                            { value: 'theme', label: '🎨 Theme Colors (Matches your brand)' },
                            { value: 'custom', label: '🖌️ Custom Color' },
                        ]}
                    />

                    {props.colorMode === 'theme' && (
                        <SelectInput
                            label="Choose Theme Color"
                            value={props.themeColor}
                            onChange={val => setProp((p: TextProps) => (p.themeColor = val as any))}
                            options={[
                                { value: 'foreground', label: 'Main Text Color' },
                                { value: 'primary', label: 'Primary Brand Color' },
                                { value: 'secondary', label: 'Secondary Color' },
                                { value: 'accent', label: 'Accent Color' },
                                { value: 'muted', label: 'Subtle/Muted' },
                            ]}
                        />
                    )}

                    {props.colorMode === 'custom' && (
                        <ColorInput
                            label="Text Color"
                            value={props.customColor || '#000000'}
                            onChange={val => setProp((p: TextProps) => (p.customColor = val))}
                        />
                    )}

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">Text Transparency</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={props.opacity ?? 100}
                            onChange={e => setProp((p: TextProps) => (p.opacity = parseInt(e.target.value)))}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                            {props.opacity ?? 100}% opacity
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'effects' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Animate on scroll"
                        value={props.animateOnView || false}
                        onChange={val => setProp((p: TextProps) => (p.animateOnView = val))}
                        // description="Text fades in when scrolled into view"
                    />
                </div>
            )}
        </SettingsTabs>
    );
}

(Text as any).craft = {
    displayName: 'Text',
    props: {
        content:
            'Add your text content here. This component is perfect for body text, descriptions, product details, and any paragraph content on your store.',
        purpose: 'body',
        size: 'base',
        weight: 'normal',
        align: 'left',
        lineHeight: 'relaxed',
        colorMode: 'theme',
        themeColor: 'foreground',
        customColor: '#000000',
        opacity: 100,
        maxWidth: true,
        indent: false,
        italic: false,
        underline: false,
        animateOnView: false,
    },
    related: { settings: TextSettings },
};
