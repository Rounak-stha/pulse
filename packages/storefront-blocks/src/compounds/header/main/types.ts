export interface LinkItem {
    id: string;
    label: string;
    type: 'internal' | 'external';
    url: string; // page ID for internal, full URL for external
}

export interface HeaderProps {
    // Logo
    logoText?: string;
    logoImage?: string;
    showLogo?: boolean;

    // Navigation
    links?: LinkItem[];
    showNavigation?: boolean;

    // Layout
    layout?: 'left' | 'center' | 'split'; // split = logo left, nav center, cta right
    sticky?: boolean;
    transparent?: boolean;

    // Styling
    backgroundColor?: string;
    textColor?: string;
    height?: 'compact' | 'normal' | 'tall';
    shadow?: boolean;

    // CTA
    showCTA?: boolean;
    ctaText?: string;
    ctaStyle?: 'primary' | 'secondary' | 'outline';

    // Callbacks
    onLogoClick?: () => void;
    onLinkClick?: (link: LinkItem) => void;
    onCTAClick?: () => void;

    // Slots
    SlotLogo?: React.ReactNode;
    SlotCTA?: React.ReactNode;

    ref?: React.Ref<HTMLElement>;
    selected?: boolean;
}
