import { ThemeConfig } from '@/vdb/components/builder/types.js';

export const CANVAS_ROOT_ID = 'canvas-root';

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
export const buildThemeConfig = (data?: string) => {
    const clonedConfig: ThemeConfig = JSON.parse(JSON.stringify(defaultThemeConfig));

    if (!data) return clonedConfig;

    let parsedTheme: Record<string, string> = {};

    try {
        parsedTheme = JSON.parse(data);
    } catch {
        parsedTheme = {};
    }

    for (let [key, value] of Object.entries(clonedConfig)) {
        if (parsedTheme[value.key]) {
            clonedConfig[key as keyof typeof defaultThemeConfig].value = parsedTheme[value.key];
        }
    }
    return clonedConfig;
};

export const buildThemePairFromConfig = (config: ThemeConfig) => {
    const themeValue: Record<string, string> = {};

    for (let [_, value] of Object.entries(config)) {
        themeValue[value.key] = value.value;
    }
    return themeValue;
};

export const setThemeOnCanvas = (theme: string) => {
    let parsedTheme: Record<string, string> = {};

    try {
        parsedTheme = JSON.parse(theme);
    } catch {
        parsedTheme = buildThemePairFromConfig(defaultThemeConfig);
    }
    const rootNode = document.getElementById(CANVAS_ROOT_ID);

    if (!rootNode) return;

    Object.entries(parsedTheme).forEach(([key, value]) => {
        rootNode.style.setProperty(key, value);
    });
};

export const setThemeValueOnCanvas = (key: string, value: string) => {
    const rootNode = document.getElementById(CANVAS_ROOT_ID);

    if (!rootNode) return;

    rootNode.style.setProperty(key, value);
};
