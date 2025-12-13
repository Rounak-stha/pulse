import { Plugin } from 'vite';

type ThemeColors = {
    background?: string;
    foreground?: string;
    card?: string;
    'card-foreground'?: string;
    popover?: string;
    'popover-foreground'?: string;
    primary?: string;
    'primary-foreground'?: string;
    secondary?: string;
    'secondary-foreground'?: string;
    muted?: string;
    'muted-foreground'?: string;
    accent?: string;
    'accent-foreground'?: string;
    destructive?: string;
    'destructive-foreground'?: string;
    success?: string;
    'success-foreground'?: string;
    'dev-mode'?: string;
    'dev-mode-foreground'?: string;
    border?: string;
    input?: string;
    ring?: string;
    'chart-1'?: string;
    'chart-2'?: string;
    'chart-3'?: string;
    'chart-4'?: string;
    'chart-5'?: string;
    radius?: string;
    sidebar?: string;
    'sidebar-foreground'?: string;
    'sidebar-primary'?: string;
    'sidebar-primary-foreground'?: string;
    'sidebar-accent'?: string;
    'sidebar-accent-foreground'?: string;
    'sidebar-border'?: string;
    'sidebar-ring'?: string;
    brand?: string;
    'brand-lighter'?: string;
    'brand-darker'?: string;
    'font-sans'?: string;
    'font-mono'?: string;
    [key: string]: string | undefined;
};

export interface ThemeVariables {
    light?: ThemeColors;
    dark?: ThemeColors;
}

const defaultVariables: ThemeVariables = {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.141 0.005 285.823)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.141 0.005 285.823)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.141 0.005 285.823)',
      primary: 'oklch(0.606 0.25 292.717)',
      'primary-foreground': 'oklch(0.969 0.016 293.756)',
      secondary: 'oklch(0.967 0.001 286.375)',
      'secondary-foreground': 'oklch(0.21 0.006 285.885)',
      muted: 'oklch(0.967 0.001 286.375)',
      'muted-foreground': 'oklch(0.552 0.016 285.938)',
      accent: 'oklch(0.967 0.001 286.375)',
      'accent-foreground': 'oklch(0.21 0.006 285.885)',
      destructive: 'oklch(0.577 0.245 27.325)',
      'destructive-foreground': 'oklch(0.9851 0 0)',
      success: 'hsl(100, 81%, 35%)',
      'success-foreground': 'hsl(0 0% 98%)',
      'dev-mode': 'hsl(204, 76%, 62%)',
      'dev-mode-foreground': 'hsl(0 0% 98%)',
      border: 'oklch(0.92 0.004 286.32)',
      input: 'oklch(0.92 0.004 286.32)',
      ring: 'oklch(0.606 0.25 292.717)',
      'chart-1': 'oklch(0.646 0.222 41.116)',
      'chart-2': 'oklch(0.6 0.118 184.704)',
      'chart-3': 'oklch(0.398 0.07 227.392)',
      'chart-4': 'oklch(0.828 0.189 84.429)',
      'chart-5': 'oklch(0.769 0.188 70.08)',
      radius: '0.375rem',
      sidebar: 'oklch(0.985 0 0)',
      'sidebar-foreground': 'oklch(0.141 0.005 285.823)',
      'sidebar-primary': 'oklch(0.606 0.25 292.717)',
      'sidebar-primary-foreground': 'oklch(0.969 0.016 293.756)',
      'sidebar-accent': 'oklch(0.967 0.001 286.375)',
      'sidebar-accent-foreground': 'oklch(0.21 0.006 285.885)',
      'sidebar-border': 'oklch(0.92 0.004 286.32)',
      'sidebar-ring': 'oklch(0.606 0.25 292.717)',
      brand: '#17c1ff',
      'brand-lighter': '#e6f9ff',
      'brand-darker': '#0099ff',
      'font-sans': 'Inter, sans-serif',
      'font-mono': 'Geist Mono, monospace',
    },
    dark: {
      background: 'oklch(0.141 0.005 285.823)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.21 0.006 285.885)',
      'card-foreground': 'oklch(0.985 0 0)',
      popover: 'oklch(0.21 0.006 285.885)',
      'popover-foreground': 'oklch(0.985 0 0)',
      primary: 'oklch(0.541 0.281 293.009)',
      'primary-foreground': 'oklch(0.969 0.016 293.756)',
      secondary: 'oklch(0.274 0.006 286.033)',
      'secondary-foreground': 'oklch(0.985 0 0)',
      muted: 'oklch(0.274 0.006 286.033)',
      'muted-foreground': 'oklch(0.705 0.015 286.067)',
      accent: 'oklch(0.274 0.006 286.033)',
      'accent-foreground': 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      'destructive-foreground': 'oklch(0.9851 0 0)',
      success: 'hsl(100, 100%, 35%)',
      'success-foreground': 'hsl(0 0% 98%)',
      'dev-mode': 'hsl(204, 86%, 53%)',
      'dev-mode-foreground': 'hsl(0 0% 98%)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.541 0.281 293.009)',
      'chart-1': 'oklch(0.488 0.243 264.376)',
      'chart-2': 'oklch(0.696 0.17 162.48)',
      'chart-3': 'oklch(0.769 0.188 70.08)',
      'chart-4': 'oklch(0.627 0.265 303.9)',
      'chart-5': 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.21 0.006 285.885)',
      'sidebar-foreground': 'oklch(0.985 0 0)',
      'sidebar-primary': 'oklch(0.541 0.281 293.009)',
      'sidebar-primary-foreground': 'oklch(0.969 0.016 293.756)',
      'sidebar-accent': 'oklch(0.274 0.006 286.033)',
      'sidebar-accent-foreground': 'oklch(0.985 0 0)',
      'sidebar-border': 'oklch(1 0 0 / 10%)',
      'sidebar-ring': 'oklch(0.541 0.281 293.009)',
      brand: '#17c1ff',
      'brand-lighter': '#e6f9ff',
      'brand-darker': '#0099ff',
      'font-sans': 'Inter, sans-serif',
      'font-mono': 'Geist Mono, monospace',
    },
  };

export type ThemeVariablesPluginOptions = {
    theme?: ThemeVariables;
};

export function themeVariablesPlugin(options: ThemeVariablesPluginOptions): Plugin {
    const virtualModuleId = 'virtual:admin-theme';
    const resolvedVirtualModuleId = `\0${virtualModuleId}`;

    return {
        name: 'vendure:admin-theme',
        enforce: 'pre', // This ensures our plugin runs before other CSS processors
        transform(code, id) {
            // Only transform CSS files
            if (!id.endsWith('styles.css')) {
                return null;
            }

            // Replace the @import 'virtual:admin-theme'; with our theme variables
            if (
                code.includes('@import "virtual:admin-theme";') ||
                code.includes("@import 'virtual:admin-theme';")
            ) {
                const lightTheme = options.theme?.light || {};
                const darkTheme = options.theme?.dark || {};

                // Merge default themes with custom themes
                const mergedLightTheme = { ...defaultVariables.light, ...lightTheme };
                const mergedDarkTheme = { ...defaultVariables.dark, ...darkTheme };

                const themeCSS = `
                    :root {
                        ${Object.entries(mergedLightTheme)
                            .filter(([key, value]) => value !== undefined)
                            .map(([key, value]) => `--${key}: ${value as string};`)
                            .join('\n')}
                    }

                    .dark {
                        ${Object.entries(mergedDarkTheme)
                            .filter(([key, value]) => value !== undefined)
                            .map(([key, value]) => `--${key}: ${value as string};`)
                            .join('\n')}
                    }
                `;

                return code.replace(/@import ['"]virtual:admin-theme['"];?/, themeCSS);
            }

            return null;
        },
    };
}
