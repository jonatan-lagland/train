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
                    <header className='flex flex-row justify-around mx-auto py-3 px-3 md:px-12 md:py-8 min-w-full'>
                        <Nav></Nav>
                    </header>
                    <main className="flex flex-col justify-center w-full items-center p-24">
                        {children}
                    </main>
                </body>
            </NextIntlClientProvider>
        </html>
    );
}