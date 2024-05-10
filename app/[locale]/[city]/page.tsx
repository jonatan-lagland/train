import { TimeTable } from "@/components/table/timetable";
import { TrainDestination } from "@/components/table/timetable";
import Banner from "./banner";
import { getTranslations } from "next-intl/server";

export type BannerLabel = 'arrivalTrains' | 'departureTrains';
export type TimeTablePageProps = {
  params: {
    locale: string
    city: string
  }
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const { city } = params;
  const t = await getTranslations('MetaData')

  return {
    title: `${city} | ${t('titleDeparture')}`,
    description: t('description'),
  };
}

export default async function TimeTablePage({ params }: TimeTablePageProps) {
  const data: TimeTable[] = [
    {
      id: "m5gr84i9",
      stationName: "Helsinki",
      type: "ARRIVAL",
      scheduledTime: "2024-04-26T09:15:08.000Z",
      trainType: "IC",
      operatorUICCode: 7
    },
    {
      id: "3u1reuv4",
      stationName: "Vantaa",
      type: "ARRIVAL",
      scheduledTime: "2024-04-26T09:31:00.000Z",
      trainType: "IC",
      operatorUICCode: 1,
      differenceInMinutes: 1
    },
    {
      id: "3u1reuv5",
      stationName: "Kokkola",
      type: "ARRIVAL",
      scheduledTime: "2024-04-26T09:39:00.000Z",
      trainType: "IC",
      operatorUICCode: 53,
      differenceInMinutes: 1
    },
    {
      id: "3u1reuv6",
      stationName: "Oulu",
      type: "ARRIVAL",
      scheduledTime: "2024-04-26T12:21:00.000Z",
      trainType: "IC",
      operatorUICCode: 57,
      differenceInMinutes: 1
    }
  ]

  const destination: TrainDestination = 'DEPARTURE';
  // Convert ARRIVAL or DEPARTURE to a format that is used in translation file
  const destinationLabel: BannerLabel = destination === 'ARRIVAL' ? 'arrivalTrains' : 'departureTrains';
  const city: string = params.city ? params.city as string : ""

  return (
    <div className="flex flex-col flex-grow h-full py-8 gap-8 max-w-4xl items-start">
      <Banner destinationLabel={destinationLabel} city={city}></Banner>
      <TimeTable data={data} destination={destination}></TimeTable>
    </div>
  );
}