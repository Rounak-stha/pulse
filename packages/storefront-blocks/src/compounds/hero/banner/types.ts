import { ReactNode } from 'react';

export type BackgroundType = 'gradient' | 'solid' | 'image' | 'video';
export type HeroLayout = 'centered' | 'left' | 'right' | 'split';
export type HeroSize = 'compact' | 'normal' | 'large' | 'fullscreen';

export interface HeroBannerProps {
    // Background
    backgroundType: BackgroundType;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    gradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'diagonal';
    overlayEnabled: boolean;
    overlayColor?: string;
    overlayOpacity?: number;

    // Layout
    layout: HeroLayout;
    size: HeroSize;
    contentWidth: 'narrow' | 'medium' | 'wide' | 'full';
    verticalAlign: 'top' | 'center' | 'bottom';

    // Content visibility
    showBadge: boolean;
    showHeadline: boolean;
    showSubtext: boolean;
    showCTA: boolean;

    // Styling
    theme: 'light' | 'dark' | 'auto';
    contentSpacing: 'compact' | 'normal' | 'relaxed';
    rounded: boolean;
    shadow: boolean;

    // Animation
    parallax: boolean;
    animateContent: boolean;

    onCTAClick?: () => void;

    SlotHeadline: ReactNode;
    SlotBadge: ReactNode;
    SlotSubtext: ReactNode;
    SlotButton: ReactNode;

    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
