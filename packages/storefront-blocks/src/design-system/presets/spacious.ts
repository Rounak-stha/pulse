import { DesignSystemConfig } from '../types.js';

export const compactDesignSystem: DesignSystemConfig = {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing for content-heavy pages',
    typography: {
        heading: {
            small: 'text-2xl md:text-3xl',
            medium: 'text-3xl md:text-4xl',
            large: 'text-4xl md:text-5xl',
            xlarge: 'text-5xl md:text-6xl',
        },
        body: {
            small: 'text-xs',
            medium: 'text-sm',
            large: 'text-base',
        },
    },
    spacing: {
        compact: 'py-8',
        normal: 'py-12',
        comfortable: 'py-16',
        spacious: 'py-20',
    },
};
