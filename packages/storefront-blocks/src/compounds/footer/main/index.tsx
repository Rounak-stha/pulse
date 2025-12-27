'use client';
import { useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { DefaultFooterProps } from './constants/props.js';
import { FooterProps } from './types.js';

const SocialIcons = {
    facebook: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
    twitter: (
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    ),
    instagram: (
        <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </>
    ),
    linkedin: (
        <>
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </>
    ),
    youtube: (
        <>
            <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </>
    ),
    github: (
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    ),
};

export const Footer: React.FC<FooterProps> = props => {
    const {
        logoText = DefaultFooterProps.logoText,
        logoImage,
        showLogo = DefaultFooterProps.showLogo,
        tagline = DefaultFooterProps.tagline,
        columns = DefaultFooterProps.columns,
        showColumns = DefaultFooterProps.showColumns,
        socialLinks = DefaultFooterProps.socialLinks,
        showSocial = DefaultFooterProps.showSocial,
        copyrightText = DefaultFooterProps.copyrightText,
        showCopyright = DefaultFooterProps.showCopyright,
        backgroundColor = DefaultFooterProps.backgroundColor,
        textColor = DefaultFooterProps.textColor,
        accentColor = DefaultFooterProps.accentColor,
        layout = DefaultFooterProps.layout,
        showNewsletter = DefaultFooterProps.showNewsletter,
        newsletterTitle = DefaultFooterProps.newsletterTitle,
        newsletterPlaceholder = DefaultFooterProps.newsletterPlaceholder,
        onLogoClick,
        onLinkClick,
        onSocialClick,
        onNewsletterSubmit,
        ref,
        selected,
    } = props;

    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && onNewsletterSubmit) {
            onNewsletterSubmit(email);
            setEmail('');
        }
    };

    return (
        <footer
            ref={ref}
            className={cn(
                'w-full transition-all duration-300',
                selected && 'ring-2 ring-blue-500 ring-inset',
            )}
            style={{ backgroundColor, color: textColor }}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8">
                <div
                    className={cn(
                        'grid gap-12',
                        layout === 'wide' && 'grid-cols-1 lg:grid-cols-12',
                        layout === 'stacked' && 'grid-cols-1',
                        layout === 'minimal' && 'grid-cols-1 md:grid-cols-2',
                    )}
                >
                    {/* Brand Section */}
                    <div
                        className={cn(
                            layout === 'wide' && 'lg:col-span-4',
                            layout === 'stacked' && 'text-center',
                        )}
                    >
                        {showLogo && (
                            <div
                                className={cn(
                                    'flex items-center gap-3 mb-4 cursor-pointer group',
                                    layout === 'stacked' && 'justify-center',
                                )}
                                onClick={onLogoClick}
                            >
                                {logoImage && (
                                    <img
                                        src={logoImage}
                                        alt={logoText}
                                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                    />
                                )}
                                <span className="font-bold text-2xl tracking-tight transition-opacity group-hover:opacity-80">
                                    {logoText}
                                </span>
                            </div>
                        )}
                        {tagline && (
                            <p
                                className="text-sm leading-relaxed mb-6 opacity-80"
                                style={{ maxWidth: layout === 'stacked' ? '100%' : '320px' }}
                            >
                                {tagline}
                            </p>
                        )}

                        {showSocial && (
                            <div className={cn('flex gap-3', layout === 'stacked' && 'justify-center')}>
                                {socialLinks?.map(social => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        onClick={e => {
                                            e.preventDefault();
                                            onSocialClick?.(social);
                                        }}
                                        className="group relative"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.platform}
                                    >
                                        <div
                                            className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                                            style={{
                                                backgroundColor: `${textColor}15`,
                                            }}
                                        >
                                            <svg
                                                className="w-5 h-5 transition-colors duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    color: textColor,
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.color = accentColor || '#3b82f6';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.color = textColor || '#e2e8f0';
                                                }}
                                            >
                                                {SocialIcons[social.platform]}
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {showColumns && (
                        <div
                            className={cn(
                                'grid gap-8',
                                layout === 'wide' && 'lg:col-span-5 grid-cols-1 sm:grid-cols-3',
                                layout === 'stacked' && 'grid-cols-2 sm:grid-cols-4 text-center',
                                layout === 'minimal' && 'hidden',
                            )}
                        >
                            {columns?.map(column => (
                                <div key={column.id}>
                                    <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 opacity-90">
                                        {column.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {column.links.map(link => (
                                            <li key={link.id}>
                                                <a
                                                    href={
                                                        link.type === 'external' ? link.url : `#${link.url}`
                                                    }
                                                    onClick={e => {
                                                        if (link.type === 'internal') {
                                                            e.preventDefault();
                                                            onLinkClick?.(link);
                                                        }
                                                    }}
                                                    className="text-sm opacity-70 hover:opacity-100 transition-all duration-200 inline-block hover:translate-x-1"
                                                    target={link.type === 'external' ? '_blank' : undefined}
                                                    rel={
                                                        link.type === 'external'
                                                            ? 'noopener noreferrer'
                                                            : undefined
                                                    }
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {showNewsletter && (
                        <div
                            className={cn(
                                layout === 'wide' && 'lg:col-span-3',
                                layout === 'stacked' && 'text-center',
                            )}
                        >
                            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 opacity-90">
                                {newsletterTitle}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={newsletterPlaceholder}
                                        className="flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                                        style={{
                                            backgroundColor: `${textColor}10`,
                                            color: textColor,
                                            borderColor: `${textColor}20`,
                                        }}
                                        onFocus={e => {
                                            e.currentTarget.style.backgroundColor = `${textColor}15`;
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.backgroundColor = `${textColor}10`;
                                        }}
                                    />
                                    <button
                                        onClick={handleNewsletterSubmit}
                                        className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                        style={{
                                            backgroundColor: accentColor,
                                            color: '#ffffff',
                                        }}
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                <p className="text-xs opacity-60">
                                    Get the latest updates and offers directly to your inbox.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showCopyright && (
                <div className="border-t" style={{ borderColor: `${textColor}15` }}>
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
                        <div
                            className={cn(
                                'flex flex-col sm:flex-row items-center gap-4',
                                layout === 'stacked' ? 'justify-center text-center' : 'justify-between',
                            )}
                        >
                            <p className="text-sm opacity-60">{copyrightText}</p>
                            <div className="flex gap-6 text-sm opacity-60">
                                <a
                                    href="#privacy"
                                    className="hover:opacity-100 transition-opacity duration-200"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#terms"
                                    className="hover:opacity-100 transition-opacity duration-200"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};
