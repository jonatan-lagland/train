import { NextIntlClientProvider, useMessages } from "next-intl";
import Nav from "@/components/nav/nav";
import { Besley, Inter, Roboto_Slab } from "next/font/google";
import Footer from "@/components/footer/footer";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body className={`${inter.variable} ${besley.variable} ${robotoslab.variable} primary`}>
          {/* Header */}
          <header className="flex-row w-full flex shadow-md px-2 justify-evenly bg-white">
            <Nav />
          </header>
          {/* Main */}
          <main>
            {children}
            <Analytics />
          </main>
          <footer className="flex flex-col justify-center px-6 py-2 w-full h-28 border bg-highlight">
            <Footer></Footer>
          </footer>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
