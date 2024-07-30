'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import NavigationContainer from '@/components/banner/navigationContainer';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type ImageTileProps = {
    src: string
    alt: string
    title: string
    delay: number
    locale: string
    href: string
}

const ImageTile = ({ src, alt, title, delay, locale, href }: ImageTileProps) => (
    <Link href={`/${locale}/${href}`} passHref>
        <motion.div
            className="relative w-full h-48 md:h-64 cursor-pointer overflow-hidden group rounded-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay }}
        >
            <div className="absolute inset-0 transition-transform duration-300 transform group-hover:scale-105">
                <Image
                    src={src}
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={alt}
                    priority={true}
                    sizes="(max-width: 600px) 600px, 
                           (max-width: 1200px) 1400px, 
                           1800px"
                    className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent rounded-lg"></div>
            </div>
            <motion.div
                className="absolute bottom-4 left-4 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
            >
                <h3 className="text-2xl font-robotoslab font-semibold">{title}</h3>
            </motion.div>
        </motion.div>
    </Link>
);

export default function Home() {
    const locale = useLocale();
    const t = useTranslations("Landing")
    const imageTiles = [
        { src: 'https://images.unsplash.com/photo-1575810034144-1abb0a8796f2', href: "Helsinki?type=departure&commuter=false", locale: locale, alt: 'Helsinki', title: 'Helsinki', delay: 1.2 },
        { src: 'https://images.unsplash.com/photo-1567792213673-cdf2c27dbde2', href: "Espoo?type=departure&commuter=true", locale: locale, alt: 'Espoo', title: 'Espoo', delay: 1.8 },
        { src: 'https://images.unsplash.com/photo-1604062604580-dab1c3baf2ae', href: "Tampere?type=departure&commuter=false", locale: locale, alt: 'Tampere', title: 'Tampere', delay: 2.4 },
        { src: 'https://images.unsplash.com/photo-1674558211660-4e9e78dc6f36', href: "Oulu?type=departure&commuter=false", locale: locale, alt: 'Oulu', title: 'Oulu', delay: 3.0 },
        { src: 'https://images.unsplash.com/photo-1649502482770-ff97033d636e', href: "Turku?type=departure&commuter=false", locale: locale, alt: 'Turku', title: 'Turku', delay: 3.6 },
        { src: 'https://images.unsplash.com/photo-1685211412960-0cc656bd868c', href: "Jyväskylä?type=departure&commuter=false", locale: locale, alt: 'Jyväskylä', title: 'Jyväskylä', delay: 4.2 },
    ];

    return (
        <div className="grid grid-rows-[1fr_1fr_1fr] md:grid-rows-[2fr_1fr_1fr] gap-4">
            <div className="relative">
                <Image
                    src="/tapio-haaja-zEQBpRm9iJA-unsplash.jpg"
                    fill
                    style={{ objectFit: 'cover' }}
                    alt="Banner"
                    priority={true}
                    quality={80}
                    className="drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                <div className="absolute inset-0 grid grid-row grid-rows-[1fr_3fr] md:grid-col md:grid-cols-[2fr_1fr] items-center text-center md:grid-rows-none p-4">
                    <div className='flex flex-col'>
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-3xl font-robotoslab md:text-6xl font-semibold text-white mb-4">
                                {t("header")}
                            </h1>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <h2 className="text-xl md:text-4xl font-normal font-robotoslab text-white mb-8">
                                {t("subheader")}
                            </h2>
                        </motion.div>
                    </div>
                    <div className="flex justify-center items-center">
                        <NavigationContainer />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8 w-full md:w-4/5">
                {imageTiles.slice(0, 3).map((tile, index) => (
                    <ImageTile key={index} {...tile} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8 w-full md:w-4/5">
                {imageTiles.slice(3, 6).map((tile, index) => (
                    <ImageTile key={index} {...tile} />
                ))}
            </div>
        </div>
    );
}