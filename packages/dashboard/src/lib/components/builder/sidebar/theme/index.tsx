import { FC, memo, useCallback, useRef } from 'react';

import { useDesignSystem } from '@/builder-blocks/design-system/context.js';
import { DESIGN_SYSTEM_PRESETS } from '@/builder-blocks/design-system/presets/index.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { Slider } from '@/vdb/components/ui/slider.js';

type ThemeVariableType = 'number' | 'string' | 'color';

interface ThemeSetting {
    label: string;
    key: string; // The CSS Variable name (e.g., '--background')
    type: ThemeVariableType;
    value: string; // The actual CSS value (e.g., 'oklch(0.99 0.002 106.423)')
}

interface ThemeConfig {
    background: ThemeSetting;
    foreground: ThemeSetting;
    card: ThemeSetting;
    cardForeground: ThemeSetting;
    popover: ThemeSetting;
    popoverForeground: ThemeSetting;
    primary: ThemeSetting;
    primaryForeground: ThemeSetting;
    secondary: ThemeSetting;
    secondaryForeground: ThemeSetting;
    muted: ThemeSetting;
    mutedForeground: ThemeSetting;
    accent: ThemeSetting;
    accentForeground: ThemeSetting;
    destructive: ThemeSetting;
    destructiveForeground: ThemeSetting;
    border: ThemeSetting;
    input: ThemeSetting;
    ring: ThemeSetting;
    radius: ThemeSetting;
}

export const defaultThemeConfig: ThemeConfig = {
    radius: {
        label: 'Border Radius',
        key: '--radius',
        type: 'number',
        value: '0.75rem',
    },
    background: {
        label: 'Background',
        key: '--background',
        type: 'color',
        value: '#FCFCFB',
    },
    foreground: {
        label: 'Foreground',
        key: '--foreground',
        type: 'color',
        value: '#2A2A33',
    },
    card: {
        label: 'Card Background',
        key: '--card',
        type: 'color',
        value: '#FFFFFF',
    },
    cardForeground: {
        label: 'Card Foreground',
        key: '--card-foreground',
        type: 'color',
        value: '#2A2A33',
    },
    popover: {
        label: 'Popover Background',
        key: '--popover',
        type: 'color',
        value: '#FFFFFF',
    },
    popoverForeground: {
        label: 'Popover Foreground',
        key: '--popover-foreground',
        type: 'color',
        value: '#2A2A33',
    },
    primary: {
        label: 'Primary',
        key: '--primary',
        type: 'color',
        value: '#404A54',
    },
    primaryForeground: {
        label: 'Primary Foreground',
        key: '--primary-foreground',
        type: 'color',
        value: '#FCFCFB',
    },
    secondary: {
        label: 'Secondary',
        key: '--secondary',
        type: 'color',
        value: '#F3F4F3',
    },
    secondaryForeground: {
        label: 'Secondary Foreground',
        key: '--secondary-foreground',
        type: 'color',
        value: '#404A54',
    },
    muted: {
        label: 'Muted Background',
        key: '--muted',
        type: 'color',
        value: '#F3F4F3',
    },
    mutedForeground: {
        label: 'Muted Foreground',
        key: '--muted-foreground',
        type: 'color',
        value: '#8B8FA3',
    },
    accent: {
        label: 'Accent Background',
        key: '--accent',
        type: 'color',
        value: '#F9F9F8',
    },
    accentForeground: {
        label: 'Accent Foreground',
        key: '--accent-foreground',
        type: 'color',
        value: '#404A54',
    },
    destructive: {
        label: 'Destructive',
        key: '--destructive',
        type: 'color',
        value: '#DD6E55',
    },
    destructiveForeground: {
        label: 'Destructive Foreground',
        key: '--destructive-foreground',
        type: 'color',
        value: '#FCFCFB',
    },
    border: {
        label: 'Border Color',
        key: '--border',
        type: 'color',
        value: '#EAEAE9',
    },
    input: {
        label: 'Input Border',
        key: '--input',
        type: 'color',
        value: '#EAEAE9',
    },
    ring: {
        label: 'Ring Color',
        key: '--ring',
        type: 'color',
        value: '#404A54',
    },
};

export function ThemePanel() {
    const { designSystem, setDesignSystemById } = useDesignSystem();

    // Store current theme values in a ref - doesn't trigger re-renders!
    const themeRef = useRef<Record<string, string>>({
        radius: defaultThemeConfig.radius.value,
        background: defaultThemeConfig.background.value,
        foreground: defaultThemeConfig.foreground.value,
        card: defaultThemeConfig.card.value,
        cardForeground: defaultThemeConfig.cardForeground.value,
        popover: defaultThemeConfig.popover.value,
        popoverForeground: defaultThemeConfig.popoverForeground.value,
        primary: defaultThemeConfig.primary.value,
        primaryForeground: defaultThemeConfig.primaryForeground.value,
        secondary: defaultThemeConfig.secondary.value,
        secondaryForeground: defaultThemeConfig.secondaryForeground.value,
        muted: defaultThemeConfig.muted.value,
        mutedForeground: defaultThemeConfig.mutedForeground.value,
        accent: defaultThemeConfig.accent.value,
        accentForeground: defaultThemeConfig.accentForeground.value,
        destructive: defaultThemeConfig.destructive.value,
        destructiveForeground: defaultThemeConfig.destructiveForeground.value,
        border: defaultThemeConfig.border.value,
        input: defaultThemeConfig.input.value,
        ring: defaultThemeConfig.ring.value,
    });

    const handleThemeChange = useCallback((key: string, value: string) => {
        const setting = defaultThemeConfig[key as keyof ThemeConfig];
        if (!setting) return;

        // Update ref (no re-render)
        themeRef.current[key] = value;

        // Update DOM directly
        const root = document.getElementById('canvas-root');
        if (root) {
            root.style.setProperty(setting.key, value);
        }
    }, []);

    const handleRadiusChange = useCallback(
        (val: number) => {
            handleThemeChange('radius', `${val}rem`);
        },
        [handleThemeChange],
    );

    const handleDesignSystemChange = useCallback(
        (presetId: string) => {
            setDesignSystemById(presetId);
            // TODO: Save to database/state management
            console.log('Design system changed to:', presetId);
        },
        [setDesignSystemById],
    );

    const handleSave = useCallback(async () => {
        const currentTheme = themeRef.current;
        const currentDesignSystem = designSystem.id;

        console.log('Saving configuration:', {
            theme: currentTheme,
            designSystemPresetId: currentDesignSystem,
        });

        // TODO: Save to your database
        // await saveConfiguration({
        //   themeConfig: currentTheme,
        //   designSystemPresetId: currentDesignSystem,
        // });

        alert('Configuration saved! Check console for values.');
    }, [designSystem.id]);

    const { radius: radiusConfig, ...colorConfig } = defaultThemeConfig;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">Theme & Design</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs">Design System Preset</Label>
                    <Select value={designSystem.id} onValueChange={handleDesignSystemChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DESIGN_SYSTEM_PRESETS.map(preset => (
                                <SelectItem key={preset.id} value={preset.id}>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-xs">{preset.name}</span>
                                        {preset.description && (
                                            <span className="text-xs text-muted-foreground">
                                                {preset.description}
                                            </span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <Label>Border Radius</Label>
                    <Slider
                        defaultValue={[0.75]}
                        min={0}
                        max={2}
                        step={0.05}
                        onValueChange={val => handleRadiusChange(val[0])}
                    />
                </div>

                <Separator />

                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Color Variables</Label>
                    {Object.entries(colorConfig).map(([key, value]) => (
                        <ThemeColor
                            key={key}
                            name={key}
                            label={value.label}
                            value={value.value}
                            onChange={handleThemeChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ThemeColorProps {
    name: string;
    label: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

const ThemeColor: FC<ThemeColorProps> = memo(({ name, label, value, onChange: handleChange }) => {
    return (
        <div className="space-y-1">
            <Label htmlFor={`theme-${name}`} className="text-xs">
                {label}
            </Label>
            <div className="flex items-center space-x-2">
                <Input
                    id={`theme-${name}`}
                    type="color"
                    defaultValue={value}
                    onChange={e => handleChange(name, e.target.value)}
                    className="p-0 border-none w-full h-10"
                />
            </div>
        </div>
    );
});
