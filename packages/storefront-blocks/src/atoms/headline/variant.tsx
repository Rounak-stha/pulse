import { cva } from 'class-variance-authority';

export const headlineVariants = cva('leading-tight transition-all duration-300', {
    variants: {
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            extrabold: 'font-extrabold',
            black: 'font-black',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        transform: {
            none: 'normal-case',
            uppercase: 'uppercase',
            lowercase: 'lowercase',
            capitalize: 'capitalize',
        },
        decoration: {
            none: '',
            underline: 'underline underline-offset-4',
            'line-through': 'line-through',
        },
        spacing: {
            tight: 'tracking-tight',
            normal: 'tracking-normal',
            wide: 'tracking-wide',
            wider: 'tracking-wider',
            widest: 'tracking-widest',
        },
        lineHeight: {
            none: 'leading-none',
            tight: 'leading-tight',
            snug: 'leading-snug',
            normal: 'leading-normal',
            relaxed: 'leading-relaxed',
            loose: 'leading-loose',
        },
    },
    defaultVariants: {
        weight: 'bold',
        align: 'left',
        transform: 'none',
        decoration: 'none',
        spacing: 'normal',
        lineHeight: 'tight',
    },
});
