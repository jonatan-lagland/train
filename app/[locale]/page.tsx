import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/landing/header";
import { getTranslations } from "next-intl/server";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@mui/material";
import ImageTileContainer, { ImageTile, ImageTileContainerTitle, ImageTileTitle } from "@/components/landing/imageTile";
import Link from "next/link";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: `${t("landingTitle")} | Suomilinja`,
    description: t("description"),
  };
}

export default function Home() {
  const locale = useLocale();
  const t = useTranslations("Landing");
  const imageTilesTitle = t("imageTilesTitle");
  const startDelay = 0.0; // Define the starting delay
  const imageTiles = [
    {
      src: "https://images.unsplash.com/photo-1575810034144-1abb0a8796f2",
      href: "Helsinki?type=departure&commuter=false",
      locale: locale,
      alt: "Helsinki",
      title: "Helsinki",
    },
    {
      src: "https://images.unsplash.com/photo-1567792213673-cdf2c27dbde2",
      href: "Espoo?type=departure&commuter=true",
      locale: locale,
      alt: "Espoo",
      title: "Espoo",
    },
    {
      src: "https://images.unsplash.com/photo-1604062604580-dab1c3baf2ae",
      href: "Tampere?type=departure&commuter=false",
      locale: locale,
      alt: "Tampere",
      title: "Tampere",
    },
    {
      src: "https://images.unsplash.com/photo-1674558211660-4e9e78dc6f36",
      href: "Oulu?type=departure&commuter=false",
      locale: locale,
      alt: "Oulu",
      title: "Oulu",
    },
    {
      src: "https://images.unsplash.com/photo-1649502482770-ff97033d636e",
      href: "Turku?type=departure&commuter=false",
      locale: locale,
      alt: "Turku",
      title: "Turku",
    },
    {
      src: "https://images.unsplash.com/photo-1685211412960-0cc656bd868c",
      href: "Jyväskylä?type=departure&commuter=false",
      locale: locale,
      alt: "Jyväskylä",
      title: "Jyväskylä",
    },
  ];

  return (
    <div className="grid grid-rows-[min-content_1fr] gap-16">
      <Header></Header>
      <div className="flex flex-col gap-4 py-8">
        {/* Mobile devices */}
        <div className="flex items-center justify-center md:hidden ">
          <Carousel
            opts={{
              align: "center",
              loop: false,
              dragFree: true,
            }}
            className="w-full max-w-sm">
            <CarouselContent>
              {imageTiles.map((item, index) => (
                <CarouselItem key={index} className="basis-auto relative">
                  <div className="p-1">
                    <Card>
                      <CardContent className=" h-64 w-48 p-0">
                        <Link
                          className="flex aspect-[3/5] items-center justify-center cursor-pointer"
                          href={`/${locale}/${item.href}`}
                          passHref>
                          <ImageTile src={item.src}></ImageTile>
                          <div className="absolute bottom-4 text-white">
                            <ImageTileTitle title={item.title}></ImageTileTitle>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        {/* Desktop devices */}
        <div className="hidden md:flex flex-row flex-wrap grid-cols-none gap-2 px-2 items-center justify-center w-full">
          {imageTiles.map((tile, index) => (
            <ImageTileContainer key={index} delay={startDelay + index * 0.4} {...tile} />
          ))}
        </div>
      </div>
    </div>
  );
}
