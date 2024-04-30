import { Inter } from "next/font/google";
import clsx from 'clsx';
const inter = Inter({ subsets: ["latin"] });
import { NextIntlClientProvider, useMessages } from 'next-intl';
import Nav from "@/components/nav/nav";
import NavigationSheetContent from "@/components/sidebar/navigationSheetContent";

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
                    <div className="flex h-screen">
                        <aside className="sm:flex hidden flex-none py-3 px-3 shadow-md h-screen">
                            <NavigationSheetContent></NavigationSheetContent>
                        </aside>
                        <div className="flex-auto">
                            <header className='sm:hidden flex-row w-full flex shadow-sm sm:shadow-none px-2 sm:px-16 justify-between py-3'>
                                <Nav></Nav>
                            </header>
                            <main className="px-2 py-10 sm:px-16">
                                {children}
                            </main>
                        </div>
                    </div>
                </body>
            </NextIntlClientProvider>
        </html>
    );
}