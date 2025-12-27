import { HeaderProps } from '../types.js';

export const DefaultHeaderProps: HeaderProps = {
    logoText: 'Brand',
    logoImage: undefined,
    showLogo: true,
    links: [
        { id: '1', label: 'Home', type: 'internal', url: '/home' },
        { id: '2', label: 'Shop', type: 'external', url: 'https://example.com' },
    ],
    showNavigation: true,
    layout: 'split',
    sticky: false,
    transparent: false,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    height: 'normal',
    shadow: true,
    showCTA: true,
    ctaText: 'Get Started',
    ctaStyle: 'primary',
};
