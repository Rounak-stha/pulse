import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    // Base styles
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95',
                outline:
                    'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95',
                ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
                link: 'text-primary underline-offset-4 hover:underline',
                gradient:
                    'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-100',
                glow: 'bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 hover:scale-105 active:scale-100',
                secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                success:
                    'bg-green-600 text-white shadow-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
                warning:
                    'bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
            },
            size: {
                xs: 'h-7 px-2 text-xs',
                sm: 'h-9 px-3 text-sm',
                md: 'h-11 px-6 text-base',
                lg: 'h-13 px-8 text-lg',
                xl: 'h-16 px-10 text-xl',
            },
            rounded: {
                none: 'rounded-none',
                sm: 'rounded-sm',
                md: 'rounded-md',
                lg: 'rounded-lg',
                xl: 'rounded-xl',
                full: 'rounded-full',
            },
            fullWidth: {
                true: 'w-full',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            rounded: 'md',
            fullWidth: false,
        },
    },
);

export const iconVariants = cva('transition-transform', {
    variants: {
        size: {
            xs: 'w-3 h-3',
            sm: 'w-3.5 h-3.5',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
            xl: 'w-6 h-6',
        },
        position: {
            left: 'mr-2',
            right: 'ml-2 group-hover:translate-x-1',
        },
    },
    defaultVariants: {
        size: 'md',
        position: 'right',
    },
});
