import NavigationContainer from '@/components/banner/navigationContainer';
import Nav from '@/components/nav/nav';
export const dynamic = 'force-dynamic'
import RouterBackButton from '@/components/ui/router-back';
import { NextIntlClientProvider, useLocale, useMessages, useTranslations } from 'next-intl';
import { Besley, Inter, Roboto_Slab } from 'next/font/google';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

const besley = Besley({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: "--besley",
});

const inter = Inter({
    subsets: ['latin'],
    variable: "--inter",
});
const robotoslab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: "--robotoslab",
});

export default function NotFound() {
    const t = useTranslations('NotFoundPage');
    const locale = useLocale()
    const messages = useMessages();
    const returnLabel = t('return')

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <body className={`${inter.variable} ${besley.variable} ${robotoslab.variable} flex flex-col body-404 h-screen`}>
                    <header className='flex-row w-full flex shadow-md justify-evenly bg-white'>
                        <Nav></Nav>
                    </header>
                    <main className="grid grid-rows-2">
                        <div className="flex flex-col justify-center items-center p-2 gap-8">
                            <div className='flex flex-col gap-2'>
                                <h1 className="text-8xl font-robotoslab font-semibold text-white">404</h1>
                                <h2 className="text-4xl font-robotoslab text-white">{t('title')}</h2>
                                <h3 className="font-robotoslab text-white">{t('description')}</h3>
                            </div>
                            <RouterBackButton label={returnLabel}></RouterBackButton>
                        </div>
                        <NavigationContainer isNotFoundPage={true} />
                    </main>
                </body>
            </NextIntlClientProvider>
        </html>
    );

}