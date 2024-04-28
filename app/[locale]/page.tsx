import { Link } from "@/navigation";
import { TimeTable } from "@/components/table/timetable";
import { useTranslations } from "next-intl";
import { TrainDestination } from "@/components/table/timetable";
import { SelectLanguage } from "@/components/nav/selectLanguage";

export default function Home() {

  const t = useTranslations()

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
  const destinationLabel: 'arrivalTrains' | 'departureTrains' = destination === 'ARRIVAL' ? 'arrivalTrains' : 'departureTrains';

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold">Kokkola</h1>
        <h2 className="text-xl font-semibold">{t(`TimeTable.${destinationLabel}`)}</h2>
      </div>
      <TimeTable data={data} destination={destination}></TimeTable>
    </div>
  );
}