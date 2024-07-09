import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const params = url.searchParams;
    const pathname = url.pathname;
    // Regular expression to match paths like /<locale>/<city>
    const cityPathPattern = /^\/(en|fi|se)\/[^/]+$/;

    // Remove any unwanted parameters
    params.forEach((value, key) => {
        if (key !== 'type' && key !== 'destination') {
            params.delete(key);
        }
    });

    let shouldRedirect = false;
    if (cityPathPattern.test(pathname)) {
        if (!params.has('type') || (params.get('type') !== 'departure' && params.get('type') !== 'arrival')) {
            params.set('type', 'departure');
            shouldRedirect = true;
        }
    }

    // Update the URL with the modified search parameters
    url.search = params.toString();

    const handleI18nRouting = createMiddleware({
        locales: ['en', 'fi', 'se'],
        defaultLocale: 'fi'
    });

    const response = handleI18nRouting(request);

    if (shouldRedirect) {
        url.search = params.toString();
        return NextResponse.redirect(url);
    }
    return response;
}


export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(en|fi|se)/:path*']
};