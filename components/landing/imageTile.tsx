'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import Image from 'next/image';

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
            className={`relative h-44 md:h-64 w-full md:w-48 cursor-pointer overflow-hidden group rounded-lg`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay }}
        >
            <div className="absolute inset-0 transition-transform duration-300 transform group-hover:scale-105">
                <Image
                    src={src}
                    fill
                    quality={25}
                    style={{ objectFit: 'cover' }}
                    alt={''}
                    sizes=",
                    (max-width: 640px) 700px,
                            (max-width: 768px) 850px,
                            550px"
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

export default ImageTile;