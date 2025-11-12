import { ArrowRight, Check, ChevronRight, Download, ExternalLink, Play, Plus } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils.js';
import { ButtonProps } from './types.js';
import { buttonVariants, iconVariants } from './variants.js';

const iconMap = {
    arrow: ArrowRight,
    chevron: ChevronRight,
    external: ExternalLink,
    download: Download,
    play: Play,
    plus: Plus,
    check: Check,
};

export const Button: React.FC<ButtonProps> = ({
    text,
    variant = 'default',
    size = 'md',
    rounded = 'md',
    fullWidth = false,
    colorMode = 'theme',
    customBgColor,
    customTextColor,
    customBorderColor,
    customGradientStart,
    customGradientEnd,
    customShadowColor,
    iconType = 'arrow',
    iconPosition = 'right',
    showIcon = true,
    disabled = false,
    onClick,
    className,
    ref,
}) => {
    const Icon = iconMap[iconType];

    // Generate custom styles only when in custom color mode
    const getCustomStyles = (): React.CSSProperties => {
        if (colorMode !== 'custom') return {};

        const styles: React.CSSProperties = {};

        switch (variant) {
            case 'default':
            case 'secondary':
            case 'destructive':
            case 'success':
            case 'warning':
                if (customBgColor) styles.backgroundColor = customBgColor;
                if (customTextColor) styles.color = customTextColor;
                break;

            case 'outline':
                if (customBorderColor) styles.borderColor = customBorderColor;
                if (customTextColor) styles.color = customTextColor;
                break;

            case 'ghost':
            case 'link':
                if (customTextColor) styles.color = customTextColor;
                break;

            case 'gradient':
                if (customGradientStart && customGradientEnd) {
                    styles.backgroundImage = `linear-gradient(to right, ${customGradientStart}, ${customGradientEnd})`;
                }
                if (customTextColor) styles.color = customTextColor;
                break;

            case 'glow':
                if (customBgColor) {
                    styles.backgroundColor = customBgColor;
                    if (customShadowColor) {
                        styles.boxShadow = `0 10px 40px -10px ${customShadowColor}`;
                    }
                }
                if (customTextColor) styles.color = customTextColor;
                break;
        }

        return styles;
    };

    const renderIcon = () => {
        if (!showIcon || iconPosition === 'none' || !Icon) return null;

        return (
            <Icon
                className={iconVariants({
                    size,
                    position: iconPosition as 'left' | 'right',
                })}
            />
        );
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            className={cn('group', buttonVariants({ variant, size, rounded, fullWidth }), className)}
            style={getCustomStyles()}
        >
            {iconPosition === 'left' && renderIcon()}
            <span>{text}</span>
            {iconPosition === 'right' && renderIcon()}
        </button>
    );
};
