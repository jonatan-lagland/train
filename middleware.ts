import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'fi', 'se'],
    defaultLocale: 'fi'
});


export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(en|fi|se)/:path*']
};