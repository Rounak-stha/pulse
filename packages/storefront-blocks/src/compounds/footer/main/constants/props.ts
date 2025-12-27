import { FooterProps } from '../types.js';

export const DefaultFooterProps: FooterProps = {
    logoText: 'Brand',
    showLogo: true,
    tagline: 'Building amazing experiences',
    columns: [
        {
            id: 'products',
            title: 'Products',
            links: [
                { id: '1', label: 'Features', url: 'features', type: 'internal' },
                { id: '2', label: 'Pricing', url: 'pricing', type: 'internal' },
                { id: '3', label: 'Security', url: 'security', type: 'internal' },
            ],
        },
        {
            id: 'company',
            title: 'Company',
            links: [
                { id: '4', label: 'About', url: 'about', type: 'internal' },
                { id: '5', label: 'Blog', url: 'blog', type: 'internal' },
                { id: '6', label: 'Careers', url: 'careers', type: 'internal' },
            ],
        },
        {
            id: 'support',
            title: 'Support',
            links: [
                { id: '7', label: 'Help Center', url: 'help', type: 'internal' },
                { id: '8', label: 'Contact', url: 'contact', type: 'internal' },
                { id: '9', label: 'Status', url: 'status', type: 'internal' },
            ],
        },
    ],
    showColumns: true,
    socialLinks: [
        { id: 'fb', platform: 'facebook', url: 'https://facebook.com' },
        { id: 'tw', platform: 'twitter', url: 'https://twitter.com' },
        { id: 'ig', platform: 'instagram', url: 'https://instagram.com' },
    ],
    showSocial: true,
    copyrightText: '© 2024 Brand. All rights reserved.',
    showCopyright: true,
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
    accentColor: '#3b82f6',
    layout: 'wide',
    showNewsletter: true,
    newsletterTitle: 'Subscribe to our newsletter',
    newsletterPlaceholder: 'Enter your email',
};
