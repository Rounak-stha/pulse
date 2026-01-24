import { ProductPageRuntimeProps } from '../types.js';

export const containerSizeClasses = {
    default: 'max-w-7xl',
    wide: 'max-w-screen-2xl',
    full: 'max-w-full',
};

export const spacingClasses = {
    compact: 'px-4 py-6',
    normal: 'px-4 py-8 md:px-6 md:py-12',
    comfortable: 'px-6 py-12 md:px-8 md:py-16',
};

export const gapClasses = {
    compact: 'gap-6',
    normal: 'gap-8 md:gap-12',
    comfortable: 'gap-12 md:gap-16',
};

export const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    accent: 'bg-accent/5',
};

export const borderClasses = {
    none: '',
    subtle: 'border border-border rounded-lg',
    bold: 'border-2 border-border rounded-xl shadow-sm',
};

export const layoutClasses = {
    default: 'grid-cols-1 md:grid-cols-2',
    wide: 'grid-cols-1 lg:grid-cols-5',
    sidebar: 'grid-cols-1 lg:grid-cols-3',
};

export const galleryColumnClasses = (galleryPosition: ProductPageRuntimeProps['galleryPosition']) => ({
    default: '',
    wide: galleryPosition === 'left' ? 'lg:col-span-3' : 'lg:col-span-3 lg:order-2',
    sidebar: galleryPosition === 'left' ? 'lg:col-span-2' : 'lg:col-span-2 lg:order-2',
});

export const infoColumnClasses = (galleryPosition: ProductPageRuntimeProps['galleryPosition']) => ({
    default: '',
    wide: galleryPosition === 'left' ? 'lg:col-span-2' : 'lg:col-span-2 lg:order-1',
    sidebar: galleryPosition === 'left' ? '' : 'lg:order-1',
});

export const contentAlignmentClasses = {
    start: 'items-start',
    center: 'items-center',
};
