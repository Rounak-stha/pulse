import { VariantProps } from 'class-variance-authority';
import type { ColorMode } from '../../types.js';
import { headlineVariants } from './variant.js';

export type HeadlineTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type HeadlinePurpose =
    | 'page-title'
    | 'section-title'
    | 'subsection'
    | 'small-heading'
    | 'text'
    | 'inline';
export type SizeOption = 'small' | 'medium' | 'large' | 'xlarge';

export interface HeadlineProps extends VariantProps<typeof headlineVariants> {
    text: string;
    purpose: HeadlinePurpose;
    size: SizeOption;
    autoSize: boolean;
    colorMode: ColorMode;
    themeColor: 'foreground' | 'primary' | 'secondary' | 'accent' | 'muted' | 'destructive';
    customColor?: string;
    gradient: boolean;
    gradientFrom?: string;
    gradientTo?: string;
    gradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'diagonal';
    shadow: boolean;
    shadowIntensity?: 'subtle' | 'medium' | 'strong';
    shadowColor?: string;
    maxWidth: boolean;
    animateOnView: boolean;
    className?: string;
    selected?: boolean;
    ref?: React.Ref<HTMLHeadingElement>;
}
