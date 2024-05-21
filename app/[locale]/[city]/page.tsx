import { TimeTable } from "@/components/table/timetable";
import { TrainDestination } from "@/components/table/timetable";
import Banner from "./banner";
import { getTranslations } from "next-intl/server";
import capitalizeTitle from "@/lib/utils/capitalizeTitle";
import TimetableContainer from "@/components/table/timetableContainer";

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
    <div className="flex flex-col flex-grow h-full gap-2 py-8 max-w-4xl items-start">
      <Banner destinationLabel={destinationLabel} city={city}></Banner>
      <TimetableContainer destination={destination} city={city}></TimetableContainer>
    </div>
  );
}