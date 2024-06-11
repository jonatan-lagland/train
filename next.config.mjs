import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '**',
            }
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
};

export default withNextIntl(nextConfig);