import type { VariantProps } from 'class-variance-authority';

import { Ref } from 'react';
import { buttonVariants } from './variants.js';

import type { ColorMode } from '../../types.js';

export type IconType = 'arrow' | 'chevron' | 'external' | 'download' | 'play' | 'plus' | 'check';

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
    text: string;
    colorMode?: ColorMode;
    customBgColor?: string;
    customTextColor?: string;
    customBorderColor?: string;
    customGradientStart?: string;
    customGradientEnd?: string;
    customShadowColor?: string;
    iconType?: IconType;
    iconPosition?: 'left' | 'right' | 'none';
    showIcon?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    ref?: Ref<HTMLButtonElement>;
}
