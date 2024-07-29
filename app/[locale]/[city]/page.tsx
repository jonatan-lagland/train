import { TimeTable, TrainDestination } from "@/components/table/timetable";
import Banner from "../../../components/banner/banner";
import { getTranslations } from "next-intl/server";
import capitalizeTitle from "@/lib/utils/capitalizeTitle";
import NavigationContainer from "@/components/banner/navigationContainer";
import Image from "next/image";
import fetchStationMetadata from "@/app/api/fetchStationMetadata";
import useLiveTrainData, { useTransformTrainData } from "@/lib/utils/liveTrainUtils";
import findStationDestination from "@/lib/utils/stationDestination";
import Sidebar from "@/components/sidebar/sidebar";
import { SelectedTrainProvider } from "@/lib/contextProvider/SelectedTrainProvider";

export type BannerLabel = 'arrivalTrains' | 'departureTrains';
export type TimeTablePageProps = {
  params: {
    locale: string
    city: string
  }
  searchParams?: {
    type: string
    destination: string
    commuter: string
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
  const destinationType: TrainDestination = searchParams?.type?.toUpperCase() as TrainDestination || 'DEPARTURE' as TrainDestination;
  const destinationLabel: BannerLabel = destinationType === 'DEPARTURE' ? 'departureTrains' : 'arrivalTrains'; // For localization
  const city: string = params.city ? params.city as string : ""
  const cityDestination: string = searchParams?.destination as string
  const isCommuter: string = searchParams?.commuter as string

  /* Fetch all known stations */
  const stationMetadata = await fetchStationMetadata();

  /* Verify the URL params indeed have cities that exist. Invokes 404 page if city does not exist. */
  if (city) findStationDestination(city, stationMetadata)
  if (cityDestination) findStationDestination(cityDestination, stationMetadata)

  /* After cities have been verified to exist, filter and fetch data */
  const liveTrain = await useLiveTrainData(city, destinationType, stationMetadata, isCommuter, cityDestination)
  const { liveTrainData, stationShortCode, finalStationShortCode } = liveTrain;
  const data = useTransformTrainData(liveTrainData, finalStationShortCode, stationMetadata, stationShortCode, destinationType)

  return (
    <SelectedTrainProvider>
      <div className="flex flex-col flex-grow gap-2 justify-start items-center">
        <div className="grid grid-rows-[min-content_1fr] md:grid-cols-2 md:grid-rows-none items-center justify-center relative w-full py-5">
          <div className="flex flex-row items-center justify-center h-full">
            <Banner destinationLabel={destinationLabel} city={city} cityDestination={cityDestination}></Banner>
          </div>
          <div className="flex flex-row items-center justify-center">
            <NavigationContainer></NavigationContainer>
          </div>
          <div className="absolute -z-10 w-full h-full items-center">
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
        <div className='grid grid-cols-1 grid-rows-[min-content_1fr] md:grid-cols-2 md:grid-rows-1 gap-14 md:gap-0 py-8 md:px-6 px-1'>
          <Sidebar data={data} destinationType={destinationType}></Sidebar>
          <TimeTable data={data} destinationType={destinationType}></TimeTable>
        </div>
      </div>
    </SelectedTrainProvider>
  );
}