export type DeviceType = 'desktop' | 'tablet' | 'mobile';

type ThemeVariableType = 'number' | 'string' | 'color';

type ThemeSetting = {
    label: string;
    key: string; // The CSS Variable name (e.g., '--background')
    type: ThemeVariableType;
    value: string; // The actual CSS value (e.g., 'oklch(0.99 0.002 106.423)')
};

export type ThemeConfig = {
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
};
