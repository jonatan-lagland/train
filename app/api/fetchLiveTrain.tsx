import { Train, TrainTypeParam, TrainError } from "@/lib/types";
import { headers } from "@/lib/utils";

let amount: number = 30;

type fetchLiveTrainProps = {
  stationShortCode: string | undefined;
  type: TrainTypeParam;
  isCommuter: string;
};

/**
 * A function that takes in a station short code and destination type to fetch live train data using the Fintraffic API.

 * @param {string} props.stationShortCode - A string containing a station's short code.
 * @param {TrainTypeParam} props.type - A string containing the destination type.
 * @returns {Promise<Train[] | TrainError | []>} Returns either an array of live train data or an error object as a promise from the API, or an empty array in case of a server-side exception.
 */

async function fetchLiveTrain({ stationShortCode, type, isCommuter }: fetchLiveTrainProps): Promise<Train[] | TrainError | []> {
  const trainCategory = isCommuter === "true" ? "Commuter" : "Long-distance"; // React props are treated as strings
  if (isCommuter === "true") amount = 50; // Fetch more for commuter
  const arrivalTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=${amount}&departed_trains=0&departing_trains=0&include_nonstopping=false&train_categories=${trainCategory}`;
  const departingTrains = `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=${amount}&include_nonstopping=false&train_categories=${trainCategory}`;
  try {
    if (type.toLowerCase() === "arrival") {
      const response = await fetch(arrivalTrains, { headers });
      const data: Train[] = await response.json();
      return data;
    }
    if (type.toLowerCase() === "departure") {
      const response = await fetch(departingTrains, { headers });
      const data: Train[] = await response.json();
      return data;
    }
    return []; // If neither arrival or departure due to some error, avoid fetching incorrect data
  } catch (error) {
    console.error("Error fetching live train data:", error);
    return [];
  }
}

export default fetchLiveTrain;
