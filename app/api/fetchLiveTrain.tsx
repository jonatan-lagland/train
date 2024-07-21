import { TrainDestination } from "@/components/table/timetable";
import { Train, TrainError } from "@/lib/types";

const fetchArrivingAmount: number = 10;
const fetchArrivedAmount: number = 0;
const revalidateDuration: number = 120;

type fetchLiveTrainProps = {
    stationShortCode: string | undefined
    type: TrainDestination
}

/**
 * A function that takes in a station short code and destination type to fetch live train data using the Fintraffic API.

 * @param {string} props.stationShortCode - A string containing a station's short code.
 * @param {TrainDestination} props.type - A string containing the destination type.
 * @returns {Promise<Train[] | TrainError | []>} Returns either an array of live train data or an error object as a promise from the API, or an empty array in case of a server-side exception.
 */

async function fetchLiveTrain({ stationShortCode, type }: fetchLiveTrainProps): Promise<Train[] | TrainError | []> {
    const arrivalTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=${fetchArrivedAmount}&arriving_trains=${fetchArrivingAmount}&departed_trains=0&departing_trains=0&include_nonstopping=false&train_categories=Long-distance`;
    const departingTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=0&departed_trains=${fetchArrivedAmount}&departing_trains=${fetchArrivingAmount}&include_nonstopping=false&train_categories=Long-distance`;
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
        return []; // If neither arrival or departure due to some error, avoid fetching incorrect data
    } catch (error) {
        console.error('Error fetching live train data:', error);
        return [];
    }
}

export default fetchLiveTrain;
