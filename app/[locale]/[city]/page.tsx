import { TrainDestination } from "@/components/table/timetable";
import Banner from "../../../components/banner/banner";
import { getTranslations } from "next-intl/server";
import capitalizeTitle from "@/lib/utils/capitalizeTitle";
import TimetableContainer from "@/components/table/timetableContainer";
import NavigationContainer from "@/components/banner/navigationContainer";
import Image from "next/image";

export type BannerLabel = 'arrivalTrains' | 'departureTrains';
export type TimeTablePageProps = {
  params: {
    locale: string
    city: string
  }
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const { city } = params;
  const cityLabel = decodeURIComponent(city)
  const t = await getTranslations('MetaData')

  return {
    title: `${capitalizeTitle(cityLabel)} | ${t('titleDeparture')}`,
    description: t('description'),
  };
}

export default async function TimeTablePage({ params }: TimeTablePageProps) {

  const destination: TrainDestination = 'DEPARTURE';
  // Convert ARRIVAL or DEPARTURE to a format that is used in translation file
  const destinationLabel: BannerLabel = destination === 'ARRIVAL' ? 'arrivalTrains' : 'departureTrains';
  const city: string = params.city ? params.city as string : ""

  return (
    <div className="flex flex-col flex-grow h-full gap-2 justify-start items-center">
      <div className="grid grid-cols-2 items-center justify-center relative w-full min-h-[30vh]">
        <div className="flex flex-row items-center justify-center">
          <Banner destinationLabel={destinationLabel} city={city}></Banner>
        </div>
        <div className="flex flex-row items-center justify-center">
          <NavigationContainer></NavigationContainer>
        </div>
        <div className="absolute -z-10 w-full h-full items-center ">
          <Image
            src="/detait-1cXB1KBLcFo-unsplash.jpg"
            layout="fill"
            objectFit="cover"
            alt="Banner"
            quality={25}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
        </div>
      </div>
      <div className="w-full max-w-4xl py-4 px-1">
        <TimetableContainer destination={destination} city={city}></TimetableContainer>
      </div>
    </div>
  );
}