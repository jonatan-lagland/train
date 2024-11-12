import { Train, TrainError } from "@/lib/types";

type fetchDepartureDateTrainProps = {
  date: string;
};

/**
 * A function that takes in a date to fetch train data using the Fintraffic API. Date range is from today to 6 months in the future.

 * @param {string} props.date - A string containing a date string in the format YYYY-MM-DD.
 * @returns {Promise<Train[] | TrainError | []>} Returns either an array of live train data or an error object as a promise from the API, or an empty array in case of a server-side exception.
 */

async function fetchDepartureDateTrain({ date }: fetchDepartureDateTrainProps): Promise<Train[] | TrainError | []> {
  const departureDateTrain = `https://rata.digitraffic.fi/api/v1/trains/${date}`;
  try {
    const response = await fetch(departureDateTrain);
    const data: Train[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live train data:", error);
    return [];
  }
}

export default fetchDepartureDateTrain;
