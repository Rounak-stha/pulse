import { DesignSystemConfig } from '../types.js';

export const defaultDesignSystem: DesignSystemConfig = {
    id: 'default',
    name: 'Balanced',
    description: 'Perfect balance of spacing and typography',
    typography: {
        heading: {
            small: 'text-3xl md:text-4xl',
            medium: 'text-4xl md:text-5xl',
            large: 'text-5xl md:text-7xl',
            xlarge: 'text-6xl md:text-8xl',
        },
        body: {
            small: 'text-sm',
            medium: 'text-base',
            large: 'text-lg',
        },
    },
    spacing: {
        compact: 'py-12',
        normal: 'py-16',
        comfortable: 'py-24',
        spacious: 'py-32',
    },
};
