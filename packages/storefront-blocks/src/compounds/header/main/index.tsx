'use client';
import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { cn } from '../../../lib/utils.js';
import { DefaultHeaderProps } from './constants/props.js';
import { HeaderProps } from './types.js';

const heightClasses = {
    compact: 'h-16',
    normal: 'h-20',
    tall: 'h-24',
};

export const Header: React.FC<HeaderProps> = ({
    logoText = 'Brand',
    logoImage,
    showLogo = true,
    links = DefaultHeaderProps.links || [],
    showNavigation = true,
    layout = 'split',
    sticky = false,
    transparent = false,
    backgroundColor = '#ffffff',
    textColor = '#000000',
    height = 'normal',
    shadow = true,
    showCTA = true,
    ctaText = 'Get Started',
    ctaStyle = 'primary',
    showCart = true,
    cartItemCount,
    onCartClick,
    onLogoClick,
    onLinkClick,
    onCTAClick,
    SlotLogo,
    SlotCTA,
    ref,
    selected,
}) => {
    const ctaStyleClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
        secondary: 'bg-gray-800 text-white hover:bg-gray-900 shadow-sm',
        outline: 'border-2 hover:bg-opacity-5 hover:bg-current',
    };

    const LogoContent = SlotLogo || (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
            {logoImage && (
                <img
                    src={logoImage}
                    alt={logoText}
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
            )}
            <span
                className="font-bold text-xl tracking-tight transition-opacity group-hover:opacity-80"
                style={{ color: textColor }}
            >
                {logoText}
            </span>
        </div>
    );

    const CTAContent = SlotCTA || (
        <button
            onClick={onCTAClick}
            className={cn(
                'px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ease-out',
                'hover:scale-105 active:scale-95',
                ctaStyleClasses[ctaStyle],
            )}
            style={ctaStyle === 'outline' ? { color: textColor, borderColor: textColor } : {}}
        >
            {ctaText}
        </button>
    );

    const displayCount = cartItemCount != null && cartItemCount > 9 ? '9+' : cartItemCount;

    const CartIconContent = (
        <button
            onClick={onCartClick}
            className="relative hover:opacity-70 transition-opacity"
            aria-label="Cart"
        >
            <ShoppingCart className="h-5 w-5" style={{ color: textColor }} />
            {cartItemCount != null && cartItemCount > 0 && (
                <span
                    className={cn(
                        'absolute -top-2 -right-2',
                        'min-w-[1.25rem] h-5 text-xs font-bold rounded-full',
                        'flex items-center justify-center',
                        'bg-blue-600 text-white',
                        'transition-all duration-200',
                    )}
                >
                    {displayCount}
                </span>
            )}
        </button>
    );

    return (
        <header
            ref={ref}
            className={cn(
                'w-full transition-all duration-300',
                heightClasses[height],
                sticky && 'sticky top-0 z-50 backdrop-blur-sm',
                shadow && !transparent && 'shadow-sm',
                selected && 'ring-2 ring-blue-500 ring-inset',
            )}
            style={{
                backgroundColor: transparent ? 'transparent' : backgroundColor,
                color: textColor,
            }}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full">
                <div
                    className={cn(
                        'flex items-center h-full',
                        layout === 'center' && 'justify-center gap-12',
                        layout === 'left' && 'justify-start gap-12',
                        layout === 'split' && 'justify-between',
                    )}
                >
                    {/* Logo */}
                    {showLogo && (
                        <div className={cn(layout === 'center' && 'order-first')}>{LogoContent}</div>
                    )}

                    {/* Navigation */}
                    {showNavigation && (
                        <nav
                            className={cn(
                                'flex items-center gap-8',
                                layout === 'split' && 'flex-1 justify-center',
                            )}
                        >
                            {links.map(link => (
                                <a
                                    key={link.id}
                                    href={link.type === 'external' ? link.url : `/${link.url}`}
                                    className={cn(
                                        'relative font-medium text-sm transition-all duration-200',
                                        'hover:opacity-70',
                                        'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0',
                                        'after:bg-current after:transition-all after:duration-300',
                                        'hover:after:w-full',
                                    )}
                                    style={{ color: textColor }}
                                    target={link.type === 'external' ? '_blank' : undefined}
                                    rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    )}

                    {/* Cart & CTA */}
                    {(showCart || showCTA) && (
                        <div className="flex items-center gap-4">
                            {showCart && CartIconContent}
                            {showCTA && CTAContent}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
