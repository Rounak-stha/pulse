import { DesignSystemConfig } from '../types.js';

export const boldDesignSystem: DesignSystemConfig = {
    id: 'bold',
    name: 'Bold',
    description: 'Dramatic typography for impact',
    typography: {
        heading: {
            small: 'text-4xl md:text-5xl',
            medium: 'text-5xl md:text-7xl',
            large: 'text-7xl md:text-9xl',
            xlarge: 'text-8xl md:text-[12rem]',
        },
        body: {
            small: 'text-sm',
            medium: 'text-lg',
            large: 'text-xl',
        },
    },
    spacing: {
        compact: 'py-12',
        normal: 'py-20',
        comfortable: 'py-28',
        spacious: 'py-36',
    },
};
