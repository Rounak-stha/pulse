import { DesignSystemConfig } from '../types.js';

export const spaciousDesignSystem: DesignSystemConfig = {
    id: 'spacious',
    name: 'Spacious',
    description: 'Generous spacing for luxury brands',
    typography: {
        heading: {
            small: 'text-4xl md:text-5xl',
            medium: 'text-5xl md:text-6xl',
            large: 'text-6xl md:text-8xl',
            xlarge: 'text-7xl md:text-9xl',
        },
        body: {
            small: 'text-base',
            medium: 'text-lg',
            large: 'text-xl',
        },
    },
    spacing: {
        compact: 'py-16',
        normal: 'py-24',
        comfortable: 'py-32',
        spacious: 'py-40',
    },
};
