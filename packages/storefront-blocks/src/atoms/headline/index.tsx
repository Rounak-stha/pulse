'use client';
import React from 'react';
import { useDesignSystem } from '../../design-system/context.js';
import { cn } from '../../lib/utils.js';
import { HeadlineProps, HeadlinePurpose, HeadlineTag, SizeOption } from './types.js';
import { headlineVariants } from './variant.js';

// Map user-friendly purposes to technical tags
const purposeToTagMap: Record<HeadlinePurpose, HeadlineTag> = {
    'page-title': 'h1',
    'section-title': 'h2',
    subsection: 'h3',
    'small-heading': 'h4',
    text: 'p',
    inline: 'span',
};

export const Headline: React.FC<HeadlineProps> = ({
    text,
    purpose,
    size,
    autoSize,
    weight,
    align,
    transform,
    decoration,
    spacing,
    lineHeight,
    colorMode,
    themeColor,
    customColor,
    gradient,
    gradientFrom,
    gradientTo,
    gradientDirection = 'to-right',
    shadow,
    shadowIntensity = 'medium',
    shadowColor,
    maxWidth,
    animateOnView,
    className,
    ref,
}) => {
    const { designSystem, semanticMap } = useDesignSystem();

    // Convert purpose to actual HTML tag
    const Tag = purposeToTagMap[purpose];

    // Determine the size to use
    const getSize = (): SizeOption => {
        if (autoSize && Tag in semanticMap) {
            return semanticMap[Tag as keyof typeof semanticMap];
        }
        return size || 'large';
    };

    const effectiveSize = getSize();

    // Theme color classes
    const getThemeColorClass = () => {
        if (colorMode !== 'theme') return '';

        const colorMap = {
            foreground: 'text-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            accent: 'text-accent',
            muted: 'text-muted-foreground',
            destructive: 'text-destructive',
        };

        return colorMap[themeColor];
    };

    // Gradient direction mapping
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

    // Shadow intensity mapping
    const getShadowByIntensity = () => {
        const color = shadowColor || '#00000040';
        const intensityMap = {
            subtle: `1px 1px 2px ${color}`,
            medium: `2px 2px 4px ${color}`,
            strong: `3px 3px 8px ${color}`,
        };
        return intensityMap[shadowIntensity];
    };

    // Custom styles for gradient and custom colors
    const getCustomStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if (gradient && gradientFrom && gradientTo) {
            styles.backgroundImage = `linear-gradient(${getGradientDirection()}, ${gradientFrom}, ${gradientTo})`;
            styles.WebkitBackgroundClip = 'text';
            styles.WebkitTextFillColor = 'transparent';
            styles.backgroundClip = 'text';
        } else if (colorMode === 'custom' && customColor) {
            styles.color = customColor;
        }

        if (shadow) {
            styles.textShadow = getShadowByIntensity();
        }

        return styles;
    };

    return (
        <Tag
            ref={ref}
            className={cn(
                headlineVariants({ weight, align, transform, decoration, spacing, lineHeight }),
                designSystem.typography.heading[effectiveSize],
                colorMode === 'theme' && getThemeColorClass(),
                maxWidth && 'max-w-3xl',
                animateOnView && 'opacity-0 translate-y-4 transition-all duration-700',
                className,
            )}
            style={getCustomStyles()}
            data-animate={animateOnView ? 'true' : undefined}
        >
            {text}
        </Tag>
    );
};
