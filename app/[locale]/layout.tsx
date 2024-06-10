import { NextIntlClientProvider, useMessages } from 'next-intl';
import Nav from "@/components/nav/nav";
import { Besley, Inter } from "next/font/google";

const besley = Besley({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: "--besley",
});
const inter = Inter({
    subsets: ['latin'],
    variable: "--inter",
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
                <body className={`${inter.variable} ${besley.variable} bg-[#F3F3F3] h-screen flex flex-col`}>
                    {/* Header */}
                    <header className="flex-row w-full flex shadow-sm px-2 border-b sm:px-6 justify-evenly py-3 bg-white">
                        <Nav />
                    </header>
                    {/* Main */}
                    <main className="px-2 sm:px-0 flex items-start justify-center flex-grow">
                        {children}
                    </main>
                </body>
            </NextIntlClientProvider>
        </html>
    );

}