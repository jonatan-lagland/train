import Image from 'next/image';
import NavigationContainer from '@/components/banner/navigationContainer';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations();

    return (
        <div className="relative w-full flex items-center justify-center">
            <div className="grid grid-rows-[min_content_1fr] md:grid-cols-[2fr_1fr] max-w-4xl  justify-center text-center relative w-full gap-6 pt-12 pb-6 px-2">
                <div className='flex justify-center py-12 px-4'>
                    <div className='text-white text-start font-inter'>
                        <h1 className='font-bold text-5xl mb-5'>{t("Landing.header")}</h1>
                        <h2 className='text-2xl'>{t("Landing.subheader")}</h2>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className='w-min'>
                        <NavigationContainer />
                    </div>
                </div>
            </div>
            <div className="absolute top-0 -z-10 w-full h-full items-center">
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
    )
}