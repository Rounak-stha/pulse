import type { ButtonProps } from '@/builder-blocks/atoms/button/types.js';
import { useNode } from '@craftjs/core';
import { ColorInput, SelectInput, TextInput } from '../../../common/index.js';

export function ButtonSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    return (
        <div className="space-y-4">
            <TextInput
                label="Button Text"
                value={props.text}
                onChange={val => setProp((p: ButtonProps) => (p.text = val))}
            />

            <SelectInput
                label="Variant"
                value={props.variant}
                onChange={val => setProp((p: ButtonProps) => (p.variant = val as any))}
                options={[
                    { value: 'default', label: 'Default (Primary)' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'ghost', label: 'Ghost' },
                    { value: 'link', label: 'Link' },
                    { value: 'gradient', label: 'Gradient' },
                    { value: 'glow', label: 'Glow' },
                    { value: 'destructive', label: 'Destructive' },
                    { value: 'success', label: 'Success' },
                    { value: 'warning', label: 'Warning' },
                ]}
            />

            <SelectInput
                label="Size"
                value={props.size}
                onChange={val => setProp((p: ButtonProps) => (p.size = val as any))}
                options={[
                    { value: 'xs', label: 'Extra Small' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' },
                ]}
            />

            <SelectInput
                label="Border Radius"
                value={props.rounded}
                onChange={val => setProp((p: ButtonProps) => (p.rounded = val as any))}
                options={[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' },
                    { value: 'full', label: 'Full (Pill)' },
                ]}
            />

            <SelectInput
                label="Color Mode"
                value={props.colorMode}
                onChange={val => setProp((p: ButtonProps) => (p.colorMode = val as any))}
                options={[
                    { value: 'theme', label: 'Theme Colors (CSS Variables)' },
                    { value: 'custom', label: 'Custom Colors' },
                ]}
            />

            {props.colorMode === 'custom' && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-xs text-muted-foreground">Custom color overrides for this button</p>

                    {(props.variant === 'default' ||
                        props.variant === 'secondary' ||
                        props.variant === 'destructive' ||
                        props.variant === 'success' ||
                        props.variant === 'warning') && (
                        <ColorInput
                            label="Background Color"
                            value={props.customBgColor || '#000000'}
                            onChange={val => setProp((p: ButtonProps) => (p.customBgColor = val))}
                        />
                    )}

                    {props.variant === 'gradient' && (
                        <>
                            <ColorInput
                                label="Gradient Start"
                                value={props.customGradientStart || '#000000'}
                                onChange={val => setProp((p: ButtonProps) => (p.customGradientStart = val))}
                            />
                            <ColorInput
                                label="Gradient End"
                                value={props.customGradientEnd || '#333333'}
                                onChange={val => setProp((p: ButtonProps) => (p.customGradientEnd = val))}
                            />
                        </>
                    )}

                    {props.variant === 'glow' && (
                        <>
                            <ColorInput
                                label="Background Color"
                                value={props.customBgColor || '#000000'}
                                onChange={val => setProp((p: ButtonProps) => (p.customBgColor = val))}
                            />
                            <ColorInput
                                label="Glow Color"
                                value={props.customShadowColor || '#00000080'}
                                onChange={val => setProp((p: ButtonProps) => (p.customShadowColor = val))}
                            />
                        </>
                    )}

                    <ColorInput
                        label="Text Color"
                        value={props.customTextColor || '#FFFFFF'}
                        onChange={val => setProp((p: ButtonProps) => (p.customTextColor = val))}
                    />

                    {props.variant === 'outline' && (
                        <ColorInput
                            label="Border Color"
                            value={props.customBorderColor || '#000000'}
                            onChange={val => setProp((p: ButtonProps) => (p.customBorderColor = val))}
                        />
                    )}
                </div>
            )}

            <div className="border-t pt-4">
                <label className="text-sm font-medium mb-2 block">Icon Settings</label>

                <div className="flex items-center space-x-2 mb-3">
                    <input
                        type="checkbox"
                        checked={props.showIcon}
                        onChange={e => setProp((p: ButtonProps) => (p.showIcon = e.target.checked))}
                        className="rounded"
                        id="show-icon"
                    />
                    <label htmlFor="show-icon" className="text-sm">
                        Show Icon
                    </label>
                </div>

                {props.showIcon && (
                    <div className="space-y-3">
                        <SelectInput
                            label="Icon Type"
                            value={props.iconType}
                            onChange={val => setProp((p: ButtonProps) => (p.iconType = val as any))}
                            options={[
                                { value: 'arrow', label: '→ Arrow Right' },
                                { value: 'chevron', label: '› Chevron' },
                                { value: 'external', label: '↗ External Link' },
                                { value: 'download', label: '↓ Download' },
                                { value: 'play', label: '▶ Play' },
                                { value: 'plus', label: '+ Plus' },
                                { value: 'check', label: '✓ Check' },
                            ]}
                        />

                        <SelectInput
                            label="Icon Position"
                            value={props.iconPosition}
                            onChange={val => setProp((p: ButtonProps) => (p.iconPosition = val as any))}
                            options={[
                                { value: 'left', label: 'Left' },
                                { value: 'right', label: 'Right' },
                            ]}
                        />
                    </div>
                )}
            </div>

            <div className="border-t pt-4 space-y-3">
                <label className="text-sm font-medium block">Additional Options</label>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={props.fullWidth}
                        onChange={e => setProp((p: ButtonProps) => (p.fullWidth = e.target.checked))}
                        className="rounded"
                        id="full-width"
                    />
                    <label htmlFor="full-width" className="text-sm">
                        Full Width
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={props.disabled}
                        onChange={e => setProp((p: ButtonProps) => (p.disabled = e.target.checked))}
                        className="rounded"
                        id="disabled"
                    />
                    <label htmlFor="disabled" className="text-sm">
                        Disabled State
                    </label>
                </div>
            </div>
        </div>
    );
}
