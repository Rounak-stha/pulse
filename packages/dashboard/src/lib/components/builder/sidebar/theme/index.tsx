import { FC, memo, useCallback, useMemo, useRef } from 'react';

import { useDesignSystem } from '@/builder-blocks/design-system/context.js';
import { DESIGN_SYSTEM_PRESETS } from '@/builder-blocks/design-system/presets/index.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { Slider } from '@/vdb/components/ui/slider.js';
import { buildThemeConfig, buildThemePairFromConfig, setThemeValueOnCanvas } from '@/vdb/lib/builder.js';
import { useBuilder } from '@/vdb/providers/builder.js';

export function ThemePanel() {
    const { theme, updateTheme } = useBuilder();
    const themeConfig = useMemo(() => buildThemeConfig(theme?.value), []);
    const { designSystem, setDesignSystemById } = useDesignSystem();

    // Store current theme values in a ref - doesn't trigger re-renders!
    const themeRef = useRef<Record<string, string>>(buildThemePairFromConfig(themeConfig));

    const handleThemeChange = useCallback((key: string, value: string) => {
        themeRef.current[key] = value;
        setThemeValueOnCanvas(key, value);
    }, []);

    const handleRadiusChange = useCallback(
        (val: number) => {
            handleThemeChange('--radius', `${val}rem`);
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
        if (theme?.id && currentTheme) {
            updateTheme({ id: theme.id, value: JSON.stringify(currentTheme) });
        }
    }, [designSystem.id]);

    const { radius: radiusConfig, ...colorConfig } = themeConfig;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="flex-1 font-semibold text-sm text-foreground">Theme & Design</h3>
                <Button size="xs" onClick={handleSave}>
                    Update
                </Button>
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
                            name={value.key}
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
