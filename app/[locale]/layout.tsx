import { Inter } from "next/font/google";
import clsx from 'clsx';
const inter = Inter({ subsets: ["latin"] });
import { NextIntlClientProvider, useMessages } from 'next-intl';
import Nav from "@/components/nav/nav";

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
                <body className={clsx(inter.className)}>
                    <header className='flex flex-row w-full px-2 sm:px-24 justify-between py-3'>
                        <Nav></Nav>
                    </header>
                    <main className="px-2 sm:px-24">
                        {children}
                    </main>
                </body>
            </NextIntlClientProvider>
        </html>
    );
}