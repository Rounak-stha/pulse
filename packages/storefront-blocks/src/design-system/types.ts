// design-system/types.ts

export interface TypographyScale {
    heading: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
    };
    body: {
        small: string;
        medium: string;
        large: string;
    };
}

export interface SpacingScale {
    compact: string;
    normal: string;
    comfortable: string;
    spacious: string;
}

export interface DesignSystemConfig {
    id: string;
    name: string;
    description?: string;
    typography: TypographyScale;
    spacing: SpacingScale;
}

// Semantic tag to size mapping
export type SemanticSizeMap = {
    h1: keyof TypographyScale['heading'];
    h2: keyof TypographyScale['heading'];
    h3: keyof TypographyScale['heading'];
    h4: keyof TypographyScale['heading'];
    h5: keyof TypographyScale['heading'];
    h6: keyof TypographyScale['heading'];
};

export const DEFAULT_SEMANTIC_MAP: SemanticSizeMap = {
    h1: 'xlarge',
    h2: 'large',
    h3: 'medium',
    h4: 'small',
    h5: 'small',
    h6: 'small',
};
