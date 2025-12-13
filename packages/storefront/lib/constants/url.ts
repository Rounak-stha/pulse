export const SITE_URL = (() => {
    if (
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    )
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    return 'http://localtest.com:3000';
})();

export const PathPrefix = {
    api: '/api',
    shop: '/shop',
} as const;

const withSearchParam = (path: string) => {
    return (params?: Record<string, string>) => {
        let fullPath = path;
        if (params) {
            const parsedParams = new URLSearchParams(params);
            fullPath += `?${parsedParams.toString()}`;
        }
        return fullPath;
    };
};

const SiteUrlWithoutWWWTld = new URL(SITE_URL).hostname.replace('www.', '');
export const ShopUrl = (shopKey: string) => `${shopKey}.${SiteUrlWithoutWWWTld}`;
export const ApexDomain = `.${SiteUrlWithoutWWWTld}`;

export const Paths = {
    root: withSearchParam('/'),
} as const;
