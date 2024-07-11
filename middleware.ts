import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const params = url.searchParams;
    const pathname = url.pathname;
    // Regular expression to match paths /<locale>/<city>
    const cityPathPattern = /^\/(en|fi|se)\/[^/]+$/;

    let shouldRedirect = false;

    // Remove any unwanted parameters
    params.forEach((value, key) => {
        if (key !== 'type' && key !== 'destination') {
            params.delete(key);
            shouldRedirect = true;
        }
    });

    // Remove ALL params for pages that are NOT the city page
    if (!(cityPathPattern.test(pathname))) {
        params.forEach((value, key) => {
            params.delete(key);
            shouldRedirect = true;
        });
    }

    // Applies to city path only
    if (cityPathPattern.test(pathname)) {
        // Introduce ?type=departure if no params are present
        if (!params.has('type') || (params.get('type') !== 'departure' && params.get('type') !== 'arrival')) {
            params.set('type', 'departure');
            shouldRedirect = true;
        }
        // Ensure destination trains are always of type departure
        if (params.has('destination') && params.get('type') !== 'departure') {
            params.set('type', 'departure');
            shouldRedirect = true;
        }
    }

    if (shouldRedirect) {
        // Update the URL with the modified search parameters
        url.search = params.toString();
        return NextResponse.redirect(url);
    }

    const handleI18nRouting = createMiddleware({
        locales: ['en', 'fi', 'se'],
        defaultLocale: 'fi'
    });

    const response = handleI18nRouting(request);
    return response;
}


export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(en|fi|se)/:path*']
};