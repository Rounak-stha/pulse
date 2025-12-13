import { SITE_URL } from '@/lib/constants/url';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RootDomainFormatted = new URL(SITE_URL).hostname;

function extractSubdomain(request: NextRequest): string | null {
    const host = request.headers.get('host') || ''; // tenant.localtest.com:3000
    const hostname = host.split(':')[0]; // tenant.localtest.com

    const isSubdomain = hostname !== RootDomainFormatted && !hostname.startsWith('www.');
    return isSubdomain ? hostname.split('.')[0] : null;
}

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    /* const subDomain = extractSubdomain(request);

    if (subDomain) {
        const path = request.nextUrl.pathname;
        const response = NextResponse.rewrite(new URL(`${PathPrefix.shop}/${subDomain}${path}`, request.url));
        return response;
    } */

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/opengraph-image',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
