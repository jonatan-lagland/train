import sanitizeStationName from "./sanitizeStationName";
import fetchLiveTrain from "@/app/api/fetchLiveTrain";
import {
  StationMetaData,
  TimeTable,
  Train,
  TrainDestination,
  TrainError,
} from "../types";
import fetchLiveDestinationTrain from "@/app/api/fetchLiveDestinationTrain";

type LiveTrainDataResult = {
  liveTrainData: Train[] | TrainError;
  stationShortCode: string;
  finalStationShortCode?: string;
};

/**
 * Function that fetches live train journey data for a given station from the Fintraffic API endpoint. By default, fetches
 * train journeys where no destination is defined. If a destination is provided, fetches train data from journeys
 * that go from station A to station B.
 *
 * @export
 * @async
 * @param {string} city Current active URL param of "city", with a value of the current station name in encoded URI format. **Example:** *Jyv%C3%A4skyl%C3%A4 (Jyväskylä)*
 * @param {TrainDestination} destinationType Current active URL search param of "type", with a value of either *DEPARTURE* or *ARRIVAL*
 * @param {StationMetaData[]} stationMetadata Metadata of all known passenger stations
 * @param {string} isCommuter Current active URL search param of "commuter", with a value of either *true* or *false*. **NOTE: URL search params are of type string instead of boolean**
 * @param {?string} [cityDestination] Current *optional* active URL search param of "destination", with a value of a destination station's name
 * @returns {Promise<LiveTrainDataResult>} An object containing live train data, alongside a station shortcode for the current station and an optional destination station.
 */
export default async function getLiveTrainData(
  city: string,
  destinationType: TrainDestination,
  stationMetadata: StationMetaData[],
  isCommuter: string,
  cityDestination?: string
): Promise<LiveTrainDataResult> {
  const decodedStation = decodeURIComponent(city.toLowerCase());
  const station = stationMetadata.find(
    (code) =>
      decodedStation === sanitizeStationName(code.stationName.toLowerCase())
  );
  const stationShortCode = station?.stationShortCode;

  if (!stationShortCode) {
    throw new Error(`Station not found for city: ${city}`);
  }

  let liveTrainData: Train[] | TrainError;
  let finalStationShortCode: string | undefined = undefined;

  /* If no destination has been defined, fetch and return a station with no pre-defined destination */
  if (!cityDestination) {
    liveTrainData = await fetchLiveTrain({
      stationShortCode: stationShortCode,
      type: destinationType,
      isCommuter: isCommuter,
    });
    /* RETURN EARLY WITH DATA WHERE NO DESTINATION IS SET */
    return {
      liveTrainData,
      stationShortCode,
      finalStationShortCode,
    };
  }

  /* If city destination is defined, proceed to fetch a journey with a pre-defined destination */
  const destDecodedStation = decodeURIComponent(cityDestination.toLowerCase());
  const destStation = stationMetadata.find(
    (code) =>
      destDecodedStation === sanitizeStationName(code.stationName.toLowerCase())
  );
  finalStationShortCode = destStation?.stationShortCode;

  if (!finalStationShortCode) {
    throw new Error(
      `Destination station not found for city: ${cityDestination}`
    );
  }

  liveTrainData = await fetchLiveDestinationTrain({
    departure_station: stationShortCode,
    arrival_station: finalStationShortCode,
    isCommuter: isCommuter,
  });
  return {
    liveTrainData,
    stationShortCode,
    finalStationShortCode,
  };
}

/**
 * Uses data from the Fintraffic API to generate an array of TimeTable objects that will be used to display data
 * in a table.
 *
 * @export
 * @param {(Train[] | TrainError)} liveTrainData An array of Train objects or a Train error object
 * @param {(string | undefined)} finalStationShortCode A train journey's final stopping destination short code (optional)
 * @param {StationMetaData[]} stationMetadata Metadata for all available stations.
 * @param {(string | undefined)} stationShortCode A station short code for the starting station.
 * @param {TrainDestination} destinationType Destination type of either 'ARRIVAL' or 'DEPARTURE'
 * @returns {TimeTable[] | [] } An array of TimeTable objects that represent the station stops of a given train journey, or an empty array in the case of an error.
 */
export function getTransformedTrainData(
  liveTrainData: Train[] | TrainError,
  finalStationShortCode: string | undefined,
  stationMetadata: StationMetaData[],
  stationShortCode: string | undefined,
  destinationType: TrainDestination
): TimeTable[] | [] {
  /* In case of a TrainError, exit early and return an empty array */
  if (isTrainError(liveTrainData)) return [];
  let stationStopData: TimeTable[] = [];

  liveTrainData.forEach((train) => {
    /*
     * If the train journey is of type arrival, meaning all trains should arrive at this location,
     * the "lastTrainStop" will be considered the first index in the data.
     * Otherwise it will default to the last index.
     */
    const lastTrainStop =
      destinationType === "ARRIVAL"
        ? train.timeTableRows[0]
        : train.timeTableRows[train.timeTableRows.length - 1];
    /* If a destination has been determined, set a destinationRow. Takes presedence over "lastTrainStop"  */
    const lastTrainStopAsDestination = train.timeTableRows.find(
      (row) =>
        row.stationShortCode === finalStationShortCode && row.type === "ARRIVAL"
    );
    /* Find the metadata for the final destination, e.g. the name of the station */
    const lastTrainStopMetadata = finalStationShortCode
      ? stationMetadata.find(
          (code) => code.stationShortCode === finalStationShortCode
        )
      : stationMetadata.find(
          (code) => code.stationShortCode === lastTrainStop.stationShortCode
        );

    /* Metadata for a specific station, e.g. Tampere */
    const locationMetadata = stationMetadata.find(
      (station) => station.stationShortCode === stationShortCode
    );

    /* Station coordinates for a specific station, e.g. Tampere */
    const latitude = locationMetadata ? locationMetadata.latitude : undefined;
    const longitude = locationMetadata ? locationMetadata.longitude : undefined;

    /*
     * Filter stations so that only trains where the station and journey type match
     * (arrival or destination) AND the train stops at the station
     */
    const filteredTrainStops = train.timeTableRows.filter((row) => {
      const matchesStationAndDestination =
        row.stationShortCode === stationShortCode &&
        row.type === destinationType &&
        row.trainStopping === true;
      return matchesStationAndDestination;
    });

    /* The entire journey a train goes through and all stations the train stops at. */
    const trainJourney = train.timeTableRows
      .filter((row) => {
        /* Check for a predetermined destination and exclude stations past that point */
        if (lastTrainStopAsDestination) {
          return (
            row.trainStopping === true &&
            row.commercialStop === true &&
            row.scheduledTime <= lastTrainStopAsDestination?.scheduledTime
          );
        }
        return row.trainStopping === true && row.commercialStop === true;
      })
      .map((row) => {
        const station = stationMetadata.find(
          (metadata) => metadata.stationShortCode === row.stationShortCode
        );
        return {
          ...row,
          stationName: station
            ? sanitizeStationName(station.stationName)
            : row.stationShortCode,
        };
      });

    const transformedRows = [] as TimeTable[];

    for (const row of filteredTrainStops) {
      transformedRows.push({
        stationName: lastTrainStopMetadata
          ? sanitizeStationName(lastTrainStopMetadata.stationName)
          : "", // Use the last station name or default
        departureLatitude: latitude as number,
        departureLongitude: longitude as number,
        type: row.type,
        scheduledTime: row.scheduledTime,
        liveEstimateTime: row.liveEstimateTime,
        unknownDelay: row.unknownDelay,
        scheduledFinalDestination: lastTrainStopAsDestination
          ? lastTrainStopAsDestination.liveEstimateTime
            ? lastTrainStopAsDestination.liveEstimateTime
            : lastTrainStopAsDestination.scheduledTime
          : lastTrainStop.liveEstimateTime
          ? lastTrainStop.liveEstimateTime
          : lastTrainStop.scheduledTime,
        trainType: train.trainType,
        trainNumber: train.trainNumber,
        differenceInMinutes: row.differenceInMinutes,
        commercialTrack: row.commercialTrack as string,
        cancelled: row.cancelled,
        trainJourney: trainJourney as unknown as [],
      });
    }
    stationStopData = stationStopData.concat(transformedRows);
  });

  return stationStopData;
}

/**
 * A TypeScript type guard function that validates whether data is of type Train or TrainError.

 * @param {Train[] | TrainError} data - An array of objects containing train data, or an object containing an error message.
 * @returns {boolean} True in case of an error message and false in case of no error message.
 */
export function isTrainError(data: Train[] | TrainError): data is TrainError {
  return (data as TrainError).errorMessage !== undefined;
}
