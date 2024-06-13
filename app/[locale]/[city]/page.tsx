import { TrainDestination } from "@/components/table/timetable";
import Banner from "../../../components/banner/banner";
import { getTranslations } from "next-intl/server";
import capitalizeTitle from "@/lib/utils/capitalizeTitle";
import TimetableContainer from "@/components/table/timetableContainer";
import NavigationContainer from "@/components/banner/navigationContainer";
import Image from "next/image";
import fetchStationMetadata from "@/app/api/fetchStationMetadata";
import filterStationMetadata from "@/lib/utils/filterStationMetadata";
import sanitizeStationName from "@/lib/utils/sanitizeStationName";
import fetchLiveTrain from "@/app/api/fetchLiveTrain";

export type BannerLabel = 'arrivalTrains' | 'departureTrains';
export type TimeTablePageProps = {
  params: {
    locale: string
    city: string
  }
  searchParams?: {
    type?: string
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

export default async function TimeTablePage({ params, searchParams }: TimeTablePageProps) {
  const destination: TrainDestination = searchParams?.type?.toUpperCase() as TrainDestination || 'DEPARTURE' as TrainDestination;
  const destinationLabel: BannerLabel = destination === 'DEPARTURE' ? 'departureTrains' : 'arrivalTrains'; // For localization
  const city: string = params.city ? params.city as string : ""
  const stationMetadata = await fetchStationMetadata();
  const filteredStations = filterStationMetadata(stationMetadata)
  const decodedStation = decodeURIComponent(city.toLowerCase());
  const station = stationMetadata.find(code => decodedStation === sanitizeStationName(code.stationName.toLowerCase()));
  const stationShortCode = station ? station.stationShortCode : undefined;
  const liveTrainData = await fetchLiveTrain({ station: stationShortCode, type: destination });
  const finalStationShortCode = undefined;

  return (
    <div className="flex flex-col flex-grow h-screen gap-2 justify-start items-center">
      <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-none items-center justify-center relative w-full min-h-[40vh]">
        <div className="flex flex-row items-center justify-center h-full">
          <Banner destinationLabel={destinationLabel} city={city}></Banner>
        </div>
        <div className="flex flex-row items-center justify-center">
          <NavigationContainer></NavigationContainer>
        </div>
        <div className="absolute -z-10 w-full h-full items-center ">
          <Image
            src="/tapio-haaja-XEjE_7wXAI8-unsplash.jpg"
            fill
            style={{ objectFit: 'cover' }}
            alt="Banner"
            priority={true}
            quality={80}
            sizes="(max-width: 600px) 600px, 
           (max-width: 1200px) 1400px, 
           1800px"
            className="drop-shadow-lg"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
        </div>
      </div>
      <div className="w-full h-full max-w-4xl rounded-md py-3 md:px-6 px-1">
        <TimetableContainer
          liveTrainData={liveTrainData}
          finalStationShortCode={finalStationShortCode}
          stationMetadata={filteredStations}
          stationShortCode={stationShortCode}
          destination={destination}
        ></TimetableContainer>
      </div>
    </div>
  );
}