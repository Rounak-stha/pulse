import { useNode } from '@craftjs/core';
import { useState } from 'react';

import {
    ColorInput,
    ImageUploadInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '../../../../common/index.js';

import { BackgroundType, HeroBannerProps, HeroLayout, HeroSize } from '@vendure/storefront-blocks/types';
import {
    BackgroundTypeOptions,
    ContentSpacingOptions,
    GradientDirectionOptions,
    LayoutOptions,
    SizeOptions,
    Tabs,
    VerticlePositionOptions,
    WidthOptions,
} from './constants/settings.js';

export function HeroBannerSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    return (
        <SettingsTabs tabs={Tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Hero Layout"
                        value={props.layout}
                        onChange={val => setProp((p: HeroBannerProps) => (p.layout = val as HeroLayout))}
                        options={LayoutOptions}
                    />

                    <SelectInput
                        label="Hero Size"
                        value={props.size}
                        onChange={val => setProp((p: HeroBannerProps) => (p.size = val as HeroSize))}
                        options={SizeOptions}
                    />

                    <SelectInput
                        label="Content Width"
                        value={props.contentWidth}
                        onChange={val => setProp((p: HeroBannerProps) => (p.contentWidth = val as any))}
                        options={WidthOptions}
                    />

                    <SelectInput
                        label="Vertical Position"
                        value={props.verticalAlign}
                        onChange={val => setProp((p: HeroBannerProps) => (p.verticalAlign = val as any))}
                        options={VerticlePositionOptions}
                    />

                    <SelectInput
                        label="Content Spacing"
                        value={props.contentSpacing}
                        onChange={val => setProp((p: HeroBannerProps) => (p.contentSpacing = val as any))}
                        options={ContentSpacingOptions}
                    />
                </div>
            )}

            {activeTab === 'content' && (
                <div className="space-y-4">
                    <div className="text-sm font-medium mb-2">Show/Hide Elements</div>

                    <ToggleInput
                        label="Show Badge"
                        value={props.showBadge ?? true}
                        onChange={val => setProp((p: HeroBannerProps) => (p.showBadge = val))}
                    />

                    <ToggleInput
                        label="Show Headline"
                        value={props.showHeadline ?? true}
                        onChange={val => setProp((p: HeroBannerProps) => (p.showHeadline = val))}
                    />

                    <ToggleInput
                        label="Show Description"
                        value={props.showSubtext ?? true}
                        onChange={val => setProp((p: HeroBannerProps) => (p.showSubtext = val))}
                    />

                    <ToggleInput
                        label="Show Button"
                        value={props.showCTA ?? true}
                        onChange={val => setProp((p: HeroBannerProps) => (p.showCTA = val))}
                    />

                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
                        💡 Tip: Hidden elements show as placeholders in the editor but won't appear on your
                        live site
                    </div>
                </div>
            )}

            {activeTab === 'background' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Background Type"
                        value={props.backgroundType}
                        onChange={val =>
                            setProp((p: HeroBannerProps) => (p.backgroundType = val as BackgroundType))
                        }
                        options={BackgroundTypeOptions}
                    />

                    {props.backgroundType === 'solid' && (
                        <ColorInput
                            label="Background Color"
                            value={props.backgroundColor || '#f9fafb'}
                            onChange={val => setProp((p: HeroBannerProps) => (p.backgroundColor = val))}
                        />
                    )}

                    {props.backgroundType === 'gradient' && (
                        <div className="space-y-3">
                            <ColorInput
                                label="Start Color"
                                value={props.gradientFrom || '#eff6ff'}
                                onChange={val => setProp((p: HeroBannerProps) => (p.gradientFrom = val))}
                            />
                            <ColorInput
                                label="End Color"
                                value={props.gradientTo || '#fef3c7'}
                                onChange={val => setProp((p: HeroBannerProps) => (p.gradientTo = val))}
                            />
                            <SelectInput
                                label="Gradient Direction"
                                value={props.gradientDirection || 'to-bottom'}
                                onChange={val =>
                                    setProp((p: HeroBannerProps) => (p.gradientDirection = val as any))
                                }
                                options={GradientDirectionOptions}
                            />
                        </div>
                    )}

                    {props.backgroundType === 'image' && (
                        <div className="space-y-2">
                            <ImageUploadInput
                                label="Background Image"
                                value={props.backgroundImage}
                                onChange={val => setProp((p: HeroBannerProps) => (p.backgroundImage = val))}
                            />
                        </div>
                    )}

                    {props.backgroundType === 'video' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Video URL</label>
                            <input
                                type="text"
                                value={props.backgroundVideo || ''}
                                onChange={e =>
                                    setProp((p: HeroBannerProps) => (p.backgroundVideo = e.target.value))
                                }
                                placeholder="https://example.com/hero.mp4"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Use MP4 format for best compatibility
                            </p>
                        </div>
                    )}

                    {(props.backgroundType === 'image' || props.backgroundType === 'video') && (
                        <div className="border-t pt-4 space-y-3">
                            <ToggleInput
                                label="Add Dark Overlay"
                                value={props.overlayEnabled || false}
                                onChange={val => setProp((p: HeroBannerProps) => (p.overlayEnabled = val))}
                                // description="Makes text easier to read"
                            />

                            {props.overlayEnabled && (
                                <>
                                    <ColorInput
                                        label="Overlay Color"
                                        value={props.overlayColor || '#000000'}
                                        onChange={val =>
                                            setProp((p: HeroBannerProps) => (p.overlayColor = val))
                                        }
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Overlay Strength
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={props.overlayOpacity ?? 40}
                                            onChange={e =>
                                                setProp(
                                                    (p: HeroBannerProps) =>
                                                        (p.overlayOpacity = parseInt(e.target.value)),
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {props.overlayOpacity ?? 40}%
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Text Color Theme"
                        value={props.theme}
                        onChange={val => setProp((p: HeroBannerProps) => (p.theme = val as any))}
                        options={[
                            { value: 'auto', label: '🔄 Auto (Smart detection)' },
                            { value: 'light', label: '☀️ Light (Dark text)' },
                            { value: 'dark', label: '🌙 Dark (Light text)' },
                        ]}
                    />

                    <ToggleInput
                        label="Rounded Corners"
                        value={props.rounded || false}
                        onChange={val => setProp((p: HeroBannerProps) => (p.rounded = val))}
                        // description="Adds rounded edges to hero"
                    />

                    <ToggleInput
                        label="Drop Shadow"
                        value={props.shadow || false}
                        onChange={val => setProp((p: HeroBannerProps) => (p.shadow = val))}
                        // description="Adds depth with shadow"
                    />
                </div>
            )}

            {activeTab === 'effects' && (
                <div className="space-y-4">
                    {props.backgroundType === 'image' && (
                        <ToggleInput
                            label="Parallax Effect"
                            value={props.parallax || false}
                            onChange={val => setProp((p: HeroBannerProps) => (p.parallax = val))}
                            // description="Background moves slower when scrolling"
                        />
                    )}

                    <ToggleInput
                        label="Animate Content"
                        value={props.animateContent || false}
                        onChange={val => setProp((p: HeroBannerProps) => (p.animateContent = val))}
                        // description="Content fades in on page load"
                    />

                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
                        ✨ Effects are previewed in the live site, not in the editor
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}
