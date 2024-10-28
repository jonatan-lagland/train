import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const params = url.searchParams;
    const pathname = url.pathname;
    // Regular expression to match paths /<locale>/<city>
    const cityPathPattern = /^\/(en|fi|se)\/[^/]+$/;

    function isValidDate(dateString : string) {
        // Check if dateString matches the format yyyy-mm-dd
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) return false;
    
        // Convert dateString to a Date object and reset its time to midnight
        const date = new Date(dateString);
        const [year, month, day] = dateString.split('-').map(Number);
        date.setHours(0, 0, 0, 0);
    
        // Ensure that the parsed date matches the original input
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 || // getMonth is zero-based
            date.getDate() !== day
        ) {
            return false;
        }
    
        // Define a valid range from today to 6 months from today
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate()); // Today
        startDate.setHours(0, 0, 0, 0); // Set to midnight
    
        const endDate = new Date(today);
        endDate.setMonth(today.getMonth() + 6); // 6 months from today
        endDate.setHours(0, 0, 0, 0); // Set to midnight
    
        // Check if the date falls within the range
        return date >= startDate && date <= endDate;
    }
    
    
    

    // Whether page needs to redirect due to a change in params
    let isRedirect = false;

    // Remove any unwanted parameters
    params.forEach((value, key) => {
        if (key !== 'type' && key !== 'destination' && key !== 'commuter' && key !== 'date') {
            params.delete(key);
            isRedirect = true;
        }
    });

    // Remove ALL params for pages that are NOT the city page
    if (!(cityPathPattern.test(pathname))) {
        params.forEach((value, key) => {
            params.delete(key);
            isRedirect = true;
        });
    }

    // Applies to city path only
    if (cityPathPattern.test(pathname)) {
        // Introduce ?type=departure if no params are present
        if (!params.has('type') || (params.get('type') !== 'departure' && params.get('type') !== 'arrival')) {
            params.set('type', 'departure');
            isRedirect = true;
        }
        if (!params.has('commuter') || (params.get('commuter') !== 'false' && params.get('commuter') !== 'true')) {
            params.set('commuter', 'false');
            isRedirect = true;
        }
        // Ensure destination trains are always of type departure
        if (params.has('destination') && params.get('type') !== 'departure') {
            params.set('type', 'departure');
            isRedirect = true;
        }
        // Check date is in format YYYY-MM-DD
        const date = params.get('date');
        if (params.has('date') && date && !isValidDate(date)) {
            params.delete('date');
            isRedirect = true;
        }
    }

    if (isRedirect) {
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