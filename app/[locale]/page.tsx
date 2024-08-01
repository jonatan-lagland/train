import { useLocale } from 'next-intl';
import ImageTile from '@/components/landing/imageTile';
import Header from '@/components/landing/header';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('MetaData')

    return {
        title: `Suomilinja`,
        description: t('description'),
    };
}

export default async function Home() {
    const locale = useLocale();
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
            <Header></Header>
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