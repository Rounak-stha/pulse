export interface FooterLink {
    id: string;
    label: string;
    url: string;
    type: 'internal' | 'external';
}

export interface FooterColumn {
    id: string;
    title: string;
    links: FooterLink[];
}

export interface SocialLink {
    id: string;
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
    url: string;
}

export interface FooterProps {
    logoText?: string;
    logoImage?: string;
    showLogo?: boolean;
    tagline?: string;
    columns?: FooterColumn[];
    showColumns?: boolean;
    socialLinks?: SocialLink[];
    showSocial?: boolean;
    copyrightText?: string;
    showCopyright?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    layout?: 'stacked' | 'wide' | 'minimal';
    showNewsletter?: boolean;
    newsletterTitle?: string;
    newsletterPlaceholder?: string;
    onLogoClick?: () => void;
    onLinkClick?: (link: FooterLink) => void;
    onSocialClick?: (social: SocialLink) => void;
    onNewsletterSubmit?: (email: string) => void;

    ref?: React.Ref<HTMLElement>;
    selected?: boolean;
}
