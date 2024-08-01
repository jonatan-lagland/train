import Image from 'next/image';
import NavigationContainer from '@/components/banner/navigationContainer';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations("Landing")

    return (
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
                    <h1 className="text-3xl font-robotoslab md:text-6xl font-semibold text-white mb-4">
                        {t("header")}
                    </h1>
                    <h2 className="text-xl md:text-4xl font-normal font-robotoslab text-white mb-8">
                        {t("subheader")}
                    </h2>
                </div>
                <div className="flex justify-center items-center">
                    <NavigationContainer />
                </div>
            </div>
        </div>
    )
}