// components/compound/hero-banner.tsx

import React from 'react';

import { cn } from '../../../lib/utils.js';
import {
    contentSpacingClasses,
    contentWidthClasses,
    layoutClasses,
    sizeClasses,
    verticalAlignClasses,
} from './constants/style.js';
import { HeroBannerProps } from './types.js';

export const HeroBanner: React.FC<HeroBannerProps> = ({
    backgroundType = 'gradient',
    backgroundImage,
    backgroundVideo,
    backgroundColor = '#f9fafb',
    gradientFrom = '#eff6ff',
    gradientTo = '#fef3c7',
    gradientDirection = 'to-bottom',
    overlayEnabled = false,
    overlayColor = '#000000',
    overlayOpacity = 40,

    // Layout
    layout = 'centered',
    size = 'normal',
    contentWidth = 'medium',
    verticalAlign = 'center',

    // Content visibility
    showBadge = true,
    showHeadline = true,
    showSubtext = true,
    showCTA = true,

    // Styling
    theme = 'auto',
    contentSpacing = 'normal',
    rounded = false,
    shadow = false,

    // Animation
    parallax = false,
    animateContent = false,

    onCTAClick,
    SlotHeadline,
    SlotBadge,
    SlotSubtext,
    SlotButton,
    ref,
    selected,
}) => {
    // Determine theme colors
    const getTheme = () => {
        if (theme === 'auto') {
            // Auto detect based on background
            if (backgroundType === 'image' || backgroundType === 'video') {
                return overlayEnabled && overlayOpacity > 40 ? 'dark' : 'light';
            }
            return 'light';
        }
        return theme;
    };

    const effectiveTheme = getTheme();

    // Background gradient direction
    const getGradientDirection = () => {
        const directionMap = {
            'to-right': 'to right',
            'to-left': 'to left',
            'to-bottom': 'to bottom',
            'to-top': 'to top',
            diagonal: 'to bottom right',
        };
        return directionMap[gradientDirection];
    };

    // Background styles
    const getBackgroundStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        switch (backgroundType) {
            case 'solid':
                styles.backgroundColor = backgroundColor;
                break;
            case 'gradient':
                styles.backgroundImage = `linear-gradient(${getGradientDirection()}, ${gradientFrom}, ${gradientTo})`;
                break;
            case 'image':
                if (backgroundImage) {
                    styles.backgroundImage = `url(${backgroundImage.replace(/\\/g, '/')})`;
                    styles.backgroundSize = 'cover';
                    styles.backgroundPosition = 'center';
                    if (parallax) {
                        styles.backgroundAttachment = 'fixed';
                    }
                }
                break;
        }

        return styles;
    };

    // Overlay styles
    const getOverlayStyles = (): React.CSSProperties => {
        if (!overlayEnabled) return { display: 'none' };

        return {
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
        };
    };

    // Empty state for sections
    const EmptySlot: React.FC<{ label: string }> = ({ label }) => (
        <div className="py-2 px-4 border border-dashed border-muted-foreground/30 rounded bg-muted/10">
            <p className="text-xs text-muted-foreground/50 text-center">{label}</p>
        </div>
    );

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex',
                sizeClasses[size],
                verticalAlignClasses[verticalAlign],
                rounded && 'rounded-lg overflow-hidden',
                shadow && 'shadow-2xl',
                selected && 'ring-2 ring-blue-500 ring-offset-2',
            )}
            style={getBackgroundStyles()}
        >
            {/* Video Background */}
            {backgroundType === 'video' && backgroundVideo && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            )}

            {/* Overlay */}
            <div className="absolute inset-0" style={getOverlayStyles()} />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div
                    className={cn(
                        'flex',
                        layout === 'split' ? 'flex-row' : 'flex-col',
                        layoutClasses[layout],
                        layout !== 'split' && contentWidthClasses[contentWidth],
                        layout === 'split' && 'w-full gap-8',
                        animateContent && 'opacity-0 translate-y-8 transition-all duration-1000 delay-200',
                    )}
                    data-animate={animateContent ? 'true' : undefined}
                >
                    {/* Main Content */}
                    <div
                        className={cn(
                            'flex flex-col',
                            contentSpacingClasses[contentSpacing],
                            layout === 'split' ? 'flex-1' : 'w-full',
                            layout === 'centered' && 'items-center',
                            layout === 'right' && 'items-end',
                        )}
                    >
                        {/* Badge */}
                        {showBadge ? (
                            <div className={cn(layout === 'centered' && 'mx-auto')}>{SlotBadge}</div>
                        ) : (
                            <EmptySlot label="Badge (hidden)" />
                        )}

                        {/* Headline */}
                        {showHeadline ? SlotHeadline : <EmptySlot label="Headline (hidden)" />}

                        {/* Subtext */}
                        {showSubtext ? SlotSubtext : <EmptySlot label="Subtext (hidden)" />}

                        {/* CTA Button */}
                        {showCTA ? (
                            <div className={cn(layout === 'centered' && 'mx-auto')}>{SlotButton}</div>
                        ) : (
                            <EmptySlot label="CTA Button (hidden)" />
                        )}
                    </div>

                    {/* Split Layout - Secondary Content Area */}
                    {layout === 'split' && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/10">
                                <p className="text-sm text-muted-foreground/50">
                                    Secondary content area
                                    <br />
                                    <span className="text-xs">(Add image or custom content)</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
