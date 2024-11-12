"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type ImageTileContainerProps = {
  src: string;
  alt: string;
  title: string;
  delay: number;
  locale: string;
  href: string;
};

type ImageTileContainerTitleProps = {
  delay: number;
  children: React.ReactNode;
};

type ImageTileProps = {
  src: string;
};

type ImageTileTitleProps = {
  title: string;
};

export const ImageTile = ({ src }: ImageTileProps) => {
  return (
    <div className="relative w-full h-full transition-transform duration-300 transform group-hover:scale-105">
      <Image
        src={src}
        priority
        fill={true}
        quality={10}
        style={{ objectFit: "cover" }}
        alt={""}
        sizes="
                    (max-width: 640px) 700px,
                    (max-width: 768px) 850px,
                    550px"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent rounded-lg"></div>
    </div>
  );
};

export const ImageTileTitle = ({ title }: ImageTileTitleProps) => {
  return <h3 className="text-2xl font-robotoslab font-semibold">{title}</h3>;
};

export const ImageTileContainerTitle = ({ children, delay }: ImageTileContainerTitleProps) => (
  <motion.div
    className={`text-4xl font-semibold font-robotoslab`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2, delay }}>
    {children}
  </motion.div>
);

const ImageTileContainer = ({ src, alt, title, delay, locale, href }: ImageTileContainerProps) => (
  <Link href={`/${locale}/${href}`} passHref>
    <motion.div
      className={`relative h-44 md:h-64 w-full md:w-48 cursor-pointer overflow-hidden group rounded-lg`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.4, delay }}>
      <ImageTile src={src}></ImageTile>
      <motion.div
        className="absolute bottom-4 left-4 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}>
        <ImageTileTitle title={title}></ImageTileTitle>
      </motion.div>
    </motion.div>
  </Link>
);

export default ImageTileContainer;
