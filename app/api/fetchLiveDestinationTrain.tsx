import { TrainDestination } from "@/components/table/timetable";
import { Train } from "@/lib/types";

const amount = 10;
const revalidateDuration: number = 30;

type fetchLiveDestinationTrainProps = {
    departure_station: string
    arrival_station: string
}

async function fetchLiveTrain({ departure_station, arrival_station }: fetchLiveDestinationTrainProps): Promise<Train[]> {
    const URL = `https://rata.digitraffic.fi/api/v1/live-trains/station/${arrival_station}/${departure_station}?limit=${amount}`;
    try {
        const response = await fetch(
            URL,
            { next: { revalidate: revalidateDuration } }
        );
        const data: Train[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching live train data:', error);
        return [];
    }
}

export default fetchLiveTrain;
