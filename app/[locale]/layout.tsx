import { NextIntlClientProvider, useMessages } from "next-intl";
import Nav from "@/components/nav/nav";
import { Besley, Inter, Roboto_Slab } from "next/font/google";
import Footer from "@/components/footer/footer";
import { Analytics } from "@vercel/analytics/react";

const besley = Besley({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--besley",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});
const robotoslab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--robotoslab",
});

export default function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <NextIntlClientProvider messages={messages}>
        <body className={`${inter.variable} ${besley.variable} ${robotoslab.variable} bg-[#F3F3F3]`}>
          {/* Header */}
          <header className="flex-row w-full flex shadow-md px-2 justify-evenly bg-white">
            <Nav />
          </header>
          {/* Main */}
          <main>
            {children}
            <Analytics />
          </main>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
