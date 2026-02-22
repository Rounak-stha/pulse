import { fetchPageData, parsePageTree } from '@/lib/page-data';
import { getPublishedBuilderGlobalsQuery } from '@/lib/queries/page';
import { GlobalFooterRenderer, GlobalHeaderRenderer } from '@/lib/renderer/globals';
import { cacheTag } from 'next/cache';
import { Suspense } from 'react';
import { ShopProviders } from './shop-providers';

async function getGlobals(shopcode: string) {
    'use cache';
    cacheTag('globals', `shop:${shopcode}`);
    return fetchPageData(shopcode, [{ query: getPublishedBuilderGlobalsQuery, variables: {} }]);
}

export default function ShopLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ shopcode: string }>;
}>) {
    return (
        <Suspense>
            <ShopLayoutShell params={params}>{children}</ShopLayoutShell>
        </Suspense>
    );
}

async function ShopLayoutShell({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ shopcode: string }>;
}>) {
    const { shopcode } = await params;

    return (
        <ShopProviders shopcode={shopcode}>
            <Suspense fallback={<HeaderSkeleton />}>
                <ShopHeader shopcode={shopcode} />
            </Suspense>
            {children}
            <Suspense fallback={<FooterSkeleton />}>
                <ShopFooter shopcode={shopcode} />
            </Suspense>
        </ShopProviders>
    );
}

async function ShopHeader({ shopcode }: Readonly<{ shopcode: string }>) {
    const { data } = await getGlobals(shopcode);
    const globals = data?.publishedBuilderGlobals ?? [];
    const headerGlobal = globals.find(g => g.region === 'header');
    return <GlobalHeaderRenderer tree={parsePageTree(headerGlobal?.content)} />;
}

async function ShopFooter({ shopcode }: Readonly<{ shopcode: string }>) {
    const { data } = await getGlobals(shopcode);
    const globals = data?.publishedBuilderGlobals ?? [];
    const footerGlobal = globals.find(g => g.region === 'footer');
    return <GlobalFooterRenderer tree={parsePageTree(footerGlobal?.content)} />;
}

function HeaderSkeleton() {
    return <div className="h-16 bg-gray-200 animate-pulse" />;
}

function FooterSkeleton() {
    return <div className="h-48 bg-gray-200 animate-pulse" />;
}
