'use client'
import { motion } from "framer-motion"

type ImageTileProps = {
    delay: number
    children: React.ReactNode
}

const ImageTileTitle = ({ children, delay }: ImageTileProps) => (
    <motion.div
        className={`text-4xl font-semibold font-robotoslab`}
        initial={{ opacity: 0, }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay }}
    >
        {children}
    </motion.div>

);

export default ImageTileTitle;