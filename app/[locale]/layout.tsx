import { NextIntlClientProvider, useMessages } from 'next-intl';
import Nav from "@/components/nav/nav";
import { Besley, Inter, Roboto_Slab } from "next/font/google";
import Footer from '@/components/footer/footer';
import { Analytics } from '@vercel/analytics/react';

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

export default function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const messages = useMessages();

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <body className={`${inter.variable} ${besley.variable} ${robotoslab.variable} bg-[#F3F3F3]`}>
                    {/* Header */}
                    <header className="flex-row w-full flex shadow-md px-2 justify-evenly bg-white">
                        <Nav />
                    </header>
                    {/* Main */}
                    <main className=' min-h-lvh'>
                        {children}
                        <Analytics />
                    </main>
                    <footer className="w-full h-full bg-inherit p-4 shadow-md border-y">
                        <Footer></Footer>
                    </footer>
                </body>
            </NextIntlClientProvider>
        </html>
    );
}