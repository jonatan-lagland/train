import { TrainDestination } from "@/components/table/timetable";
import { Train } from "@/lib/types";

const fetchArrivingAmount: number = 10;
const fetchArrivedAmount: number = 0;
const revalidateDuration: number = 30;

type fetchLiveTrainProps = {
    station: string
    type: TrainDestination
}

async function fetchLiveTrain({ station, type }: fetchLiveTrainProps): Promise<Train[]> {
    const arrivalTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${station}?arrived_trains=${fetchArrivedAmount}&arriving_trains=${fetchArrivingAmount}&departed_trains=0&departing_trains=0&include_nonstopping=false&train_categories=Long-distance`;
    const departingTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${station}?arrived_trains=0&arriving_trains=0&departed_trains=${fetchArrivedAmount}&departing_trains=${fetchArrivingAmount}&include_nonstopping=false&train_categories=Long-distance`;
    try {
        if (type === 'ARRIVAL') {
            const response = await fetch(
                arrivalTrains,
                { next: { revalidate: revalidateDuration } }
            );
            const data: Train[] = await response.json();
            return data;
        }
        if (type === 'DEPARTURE') {
            const response = await fetch(
                departingTrains,
                { next: { revalidate: revalidateDuration } }
            );
            const data: Train[] = await response.json();
            return data;
        }
        return []; // If neither arrival or departure due to some error, avoid sending incorrect data
    } catch (error) {
        console.error('Error fetching live train data:', error);
        return [];
    }
}

export default fetchLiveTrain;
