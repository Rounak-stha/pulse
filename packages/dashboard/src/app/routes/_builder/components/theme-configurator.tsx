// ThemeConfigurator.tsx
import type { Editor } from 'grapesjs';
import { useEffect, useState } from 'react';

interface ThemeConfig {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    background: string;
    foreground: string;
    border: string;
    borderRadius: string;
    fontFamily: string;
}

const defaultTheme: ThemeConfig = {
    primary: '#000000',
    secondary: '#6B7280',
    accent: '#3B82F6',
    muted: '#F3F4F6',
    background: '#FFFFFF',
    foreground: '#111827',
    border: '#E5E7EB',
    borderRadius: '4px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
};

interface ThemeConfiguratorProps {
    editor: Editor | null;
}

export const ThemeConfigurator = ({ editor }: ThemeConfiguratorProps) => {
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

    const updateTheme = (key: keyof ThemeConfig, value: string) => {
        const newTheme = { ...theme, [key]: value };
        setTheme(newTheme);
        applyThemeToCanvas(newTheme);
    };

    const applyThemeToCanvas = (themeConfig: ThemeConfig) => {
        if (!editor) return;

        // Create CSS variables in the canvas
        const wrapper = editor.Canvas.getDocument();
        if (!wrapper) return;

        const styleId = 'theme-variables';
        let styleTag = wrapper.head.querySelector(`#${styleId}`) as HTMLStyleElement;

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            wrapper.head.appendChild(styleTag);
        }

        styleTag.textContent = `
            :root {
                --theme-primary: ${themeConfig.primary};
                --theme-secondary: ${themeConfig.secondary};
                --theme-accent: ${themeConfig.accent};
                --theme-muted: ${themeConfig.muted};
                --theme-background: ${themeConfig.background};
                --theme-foreground: ${themeConfig.foreground};
                --theme-border: ${themeConfig.border};
                --theme-border-radius: ${themeConfig.borderRadius};
                --theme-font-family: ${themeConfig.fontFamily};
            }
        `;
    };

    const resetTheme = () => {
        setTheme(defaultTheme);
        applyThemeToCanvas(defaultTheme);
    };

    const exportTheme = () => {
        const themeJson = JSON.stringify(theme, null, 2);
        const blob = new Blob([themeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'theme.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setTheme(imported);
                applyThemeToCanvas(imported);
            } catch (error) {
                console.error('Invalid theme file', error);
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (editor) {
            applyThemeToCanvas(theme);
        }
    }, [editor]);

    return (
        <div className="p-4 space-y-4 bg-muted/20">
            <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Colors</h4>

                <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs">
                        <span>Primary</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.primary}
                                onChange={e => updateTheme('primary', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.primary}
                                onChange={e => updateTheme('primary', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Secondary</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.secondary}
                                onChange={e => updateTheme('secondary', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.secondary}
                                onChange={e => updateTheme('secondary', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Accent</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.accent}
                                onChange={e => updateTheme('accent', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.accent}
                                onChange={e => updateTheme('accent', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Muted</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.muted}
                                onChange={e => updateTheme('muted', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.muted}
                                onChange={e => updateTheme('muted', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Background</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.background}
                                onChange={e => updateTheme('background', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.background}
                                onChange={e => updateTheme('background', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Foreground</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.foreground}
                                onChange={e => updateTheme('foreground', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.foreground}
                                onChange={e => updateTheme('foreground', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between text-xs">
                        <span>Border</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={theme.border}
                                onChange={e => updateTheme('border', e.target.value)}
                                className="h-6 w-12 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.border}
                                onChange={e => updateTheme('border', e.target.value)}
                                className="w-20 px-2 py-1 text-xs border rounded"
                            />
                        </div>
                    </label>
                </div>
            </div>

            {/* Typography & Spacing */}
            <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Typography & Spacing
                </h4>

                <label className="flex items-center justify-between text-xs">
                    <span>Border Radius</span>
                    <input
                        type="text"
                        value={theme.borderRadius}
                        onChange={e => updateTheme('borderRadius', e.target.value)}
                        placeholder="4px"
                        className="w-24 px-2 py-1 text-xs border rounded"
                    />
                </label>

                <label className="flex items-center justify-between text-xs">
                    <span>Font Family</span>
                    <input
                        type="text"
                        value={theme.fontFamily}
                        onChange={e => updateTheme('fontFamily', e.target.value)}
                        placeholder="sans-serif"
                        className="w-40 px-2 py-1 text-xs border rounded"
                    />
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={resetTheme}
                    className="flex-1 px-3 py-1.5 text-xs border rounded hover:bg-muted/50 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={exportTheme}
                    className="flex-1 px-3 py-1.5 text-xs border rounded hover:bg-muted/50 transition-colors"
                >
                    Export
                </button>
                <label className="flex-1 px-3 py-1.5 text-xs border rounded hover:bg-muted/50 transition-colors text-center cursor-pointer">
                    Import
                    <input type="file" accept=".json" onChange={importTheme} className="hidden" />
                </label>
            </div>
        </div>
    );
};
