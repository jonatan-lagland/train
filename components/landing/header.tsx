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
                        src="https://images.unsplash.com/photo-1552996741-a99fe9fff192"
                        fill
                        style={{ objectFit: 'cover' }}
                        alt="Banner"
                        priority={true}
                        quality={30}
                        sizes="(max-width: 600px) 600px, 
           (max-width: 1200px) 1400px, 
           1800px"
                        className="drop-shadow-lg absolute"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-black/25"></div>
                </div>
            </div>
        </div>
    )
}