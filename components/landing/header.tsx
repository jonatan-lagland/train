import Image from 'next/image';
import NavigationContainer from '@/components/banner/navigationContainer';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations("Navigation");

    return (
        <div className="relative">
            <div className="grid grid-rows-[min-content_1fr] items-center justify-center text-center relative w-full gap-6 pt-12 pb-6 px-2">
                <div className="flex justify-center items-center">
                    <NavigationContainer title={t("title")} />
                </div>
                <div className="absolute -z-10 w-full h-full items-center">
                    <Image
                        src="/tapio-haaja-zEQBpRm9iJA-unsplash.jpg"
                        fill
                        style={{ objectFit: 'cover' }}
                        alt="Banner"
                        priority={true}
                        quality={80}
                        className="drop-shadow-lg absolute"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-black/25"></div>
                </div>
            </div>
        </div>
    )
}