import { TrainDestination } from "@/components/table/timetable";
import { Train, TrainError } from "@/lib/types";

const amount = 10;
const revalidateDuration: number = 120;

type fetchLiveDestinationTrainProps = {
    departure_station: string | undefined
    arrival_station: string | undefined
}

/**
 * A function that takes in two station short codes and attempts to fetch route-based live train data from the Fintraffic API.

 * @param {string} departure_station - A string containing the station short code for the departure location.
 * @param {string} arrival_station - A string containing the station short code for the destination.
 * @returns {Promise<Train[] | TrainError | []>} Returns either an array of live train data or an error object as a promise from the API, or an empty array in case of a server-side exception.
 */

async function fetchLiveDestinationTrain({ departure_station, arrival_station }: fetchLiveDestinationTrainProps): Promise<Train[] | TrainError | []> {
    const URL = `https://rata.digitraffic.fi/api/v1/live-trains/station/${arrival_station}/${departure_station}?limit=${amount}`;

    if (!departure_station || !arrival_station) return [];
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

export default fetchLiveDestinationTrain;
