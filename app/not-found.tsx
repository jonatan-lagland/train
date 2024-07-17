import NavigationContainer from '@/components/banner/navigationContainer';
import Nav from '@/components/nav/nav';
import { SelectLanguage } from '@/components/nav/selectLanguage';
import { Button } from '@/components/ui/button';
import RouterBackButton from '@/components/ui/router-back';
import { languages } from '@/lib/languages';
import { HomeIcon } from '@radix-ui/react-icons';
import { NextIntlClientProvider, useLocale, useMessages, useTranslations } from 'next-intl';
import Image from 'next/image';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
    const t = useTranslations('NotFoundPage');
    const locale = useLocale()
    const messages = useMessages();
    const returnLabel = t('return')

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <body className='bg-[#F3F3F3] h-screen flex flex-col'>
                    <header className='flex-row w-full flex shadow-md px-2 justify-evenly bg-white'>
                        <Nav></Nav>
                    </header>
                    <main className="flex flex-col h-screen">
                        <div className="grid grid-rows-[1fr_4fr] grid-cols-1 md:grid-rows-1 md:grid-cols-[2fr_3fr] h-full p-1">
                            <div className="flex items-start justify-center order-2 md:order-1 md:items-center">
                                <NavigationContainer isNotFoundPage={true} />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-8">
                                <div className='flex flex-col gap-2'>
                                    <h1 className="text-4xl text-center font-semibold text-white">{t('title')}</h1>
                                    <h2 className="text-2xl text-center font-semibold text-white">{t('description')}</h2>
                                </div>
                                <RouterBackButton label={returnLabel}></RouterBackButton>
                            </div>
                        </div>
                        <div className="absolute -z-10 w-full h-full items-center">
                            <Image
                                src="/tapio-haaja-zEQBpRm9iJA-unsplash.jpg"
                                fill
                                style={{ objectFit: 'cover' }}
                                alt="Banner"
                                priority={true}
                                quality={80}
                                sizes="(max-width: 600px) 600px, 
                   (max-width: 1200px) 1400px, 
                   1800px"
                                className="drop-shadow-lg"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
                        </div>
                    </main>
                </body>
            </NextIntlClientProvider>
        </html>
    );

}