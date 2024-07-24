import { TrainGPS } from "@/lib/types";

const revalidateDuration: number = 6;

/**
 * A function that takes in a station short code and destination type to fetch live train data using the Fintraffic API.

 * @param {string} props.stationShortCode - A string containing a station's short code.
 * @param {TrainDestination} props.type - A string containing the destination type.
 */

async function fetchLiveTrainGPS(stationShortCode: number) {
    if (!stationShortCode) return []

    const response = await fetch(
        `https://rata.digitraffic.fi/api/v1/train-locations/latest/${stationShortCode}`,
        { next: { revalidate: revalidateDuration } }
    );
    const data: TrainGPS[] | [] = await response.json();
    return data;
}

export default fetchLiveTrainGPS;
