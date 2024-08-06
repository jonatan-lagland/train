import { useLocale, useTranslations } from 'next-intl';
import ImageTile from '@/components/landing/imageTile';
import Header from '@/components/landing/header';
import { getTranslations } from 'next-intl/server';
import ImageTileTitle from '@/components/landing/imageTileTitle';

export async function generateMetadata() {
    const t = await getTranslations('MetaData')

    return {
        title: `Suomilinja`,
        description: t('description'),
    };
}

export default function Home() {
    const locale = useLocale();
    const t = useTranslations("Landing")
    const subheader = t("subheader")
    const startDelay = 0.0; // Define the starting delay
    const imageTiles = [
        { src: 'https://images.unsplash.com/photo-1575810034144-1abb0a8796f2', href: "Helsinki?type=departure&commuter=false", locale: locale, alt: 'Helsinki', title: 'Helsinki' },
        { src: 'https://images.unsplash.com/photo-1567792213673-cdf2c27dbde2', href: "Espoo?type=departure&commuter=true", locale: locale, alt: 'Espoo', title: 'Espoo' },
        { src: 'https://images.unsplash.com/photo-1604062604580-dab1c3baf2ae', href: "Tampere?type=departure&commuter=false", locale: locale, alt: 'Tampere', title: 'Tampere' },
        { src: 'https://images.unsplash.com/photo-1674558211660-4e9e78dc6f36', href: "Oulu?type=departure&commuter=false", locale: locale, alt: 'Oulu', title: 'Oulu' },
        { src: 'https://images.unsplash.com/photo-1649502482770-ff97033d636e', href: "Turku?type=departure&commuter=false", locale: locale, alt: 'Turku', title: 'Turku' },
        { src: 'https://images.unsplash.com/photo-1685211412960-0cc656bd868c', href: "Jyväskylä?type=departure&commuter=false", locale: locale, alt: 'Jyväskylä', title: 'Jyväskylä' },
    ];

    return (
        <div className="grid grid-rows-[min-content_1fr] gap-16">
            <Header></Header>
            <div className='flex flex-col gap-4 py-8'>
                <div className='flex items-center justify-center px-2'>
                    <ImageTileTitle delay={startDelay}>{subheader}</ImageTileTitle>
                </div>
                <div className="grid grid-cols-1 md:flex md:flex-row md:flex-wrap md:grid-cols-none gap-2 px-2 items-center justify-center w-full">
                    {imageTiles.map((tile, index) => (
                        <ImageTile key={index} delay={startDelay + index * 0.4} {...tile} />
                    ))}
                </div>
            </div>
        </div>
    );
}