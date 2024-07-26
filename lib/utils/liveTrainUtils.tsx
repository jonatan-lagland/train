import sanitizeStationName from './sanitizeStationName';
import fetchLiveTrain from '@/app/api/fetchLiveTrain';
import { StationMetaData, TimeTableRow, Train, TrainError } from '../types';
import { TimeTable, TrainDestination } from '@/components/table/timetable';
import fetchLiveDestinationTrain from '@/app/api/fetchLiveDestinationTrain';

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {string} city A value representing an encoded URI component of a given city name.
 * @param {string} cityDestination 
 * @param {TrainDestination} destinationType
 * @param {StationMetaData[]} stationMetadata
 */
export default async function useLiveTrainData(city: string, destinationType: TrainDestination, stationMetadata: StationMetaData[], isCommuter: string, cityDestination?: string) {
    const decodedStation = decodeURIComponent(city.toLowerCase());
    const station = stationMetadata.find(code => decodedStation === sanitizeStationName(code.stationName.toLowerCase()));
    const stationShortCode = station?.stationShortCode;

    if (!stationShortCode) {
        throw new Error(`Station not found for city: ${city}`);
    }

    let liveTrainData: Train[] | TrainError;
    let finalStationShortCode: string | undefined = undefined;

    /* If no destination has been defined, fetch and return a station with no pre-defined destination */
    if (!cityDestination) {
        liveTrainData = await fetchLiveTrain({ stationShortCode: stationShortCode, type: destinationType, isCommuter: isCommuter });
        return {
            liveTrainData,
            stationShortCode,
            finalStationShortCode
        };
    }

    /* Else, proceed to fetch a journey with a pre-defined destination */
    const destDecodedStation = decodeURIComponent(cityDestination.toLowerCase());
    const destStation = stationMetadata.find(code => destDecodedStation === sanitizeStationName(code.stationName.toLowerCase()));
    finalStationShortCode = destStation?.stationShortCode;

    if (!finalStationShortCode) {
        throw new Error(`Destination station not found for city: ${cityDestination}`);
    }

    liveTrainData = await fetchLiveDestinationTrain({ departure_station: stationShortCode, arrival_station: finalStationShortCode, isCommuter: isCommuter });
    return {
        liveTrainData,
        stationShortCode,
        finalStationShortCode
    };
}

/**
 * Uses unfiltered data from the Fintraffic API and filters it by only including stations at which a train stops at.
 *
 * @export
 * @param {(Train[] | TrainError)} liveTrainData An array of Train objects or a Train error object
 * @param {(string | undefined)} finalStationShortCode A train journey's final stopping destination short code
 * @param {StationMetaData[]} stationMetadata Metadata for a station.
 * @param {(string | undefined)} stationShortCode A station short code for the starting station.
 * @param {TrainDestination} destinationType Destination type of either 'ARRIVAL' or 'DEPARTURE'
 * @returns {TimeTable[] | [] } An array of TimeTable objects that represent the station stops of a given train journey, or an empty array in the case of an error.
 */
export function useTransformTrainData(
    liveTrainData: Train[] | TrainError,
    finalStationShortCode: string | undefined,
    stationMetadata: StationMetaData[],
    stationShortCode: string | undefined,
    destinationType: TrainDestination
): TimeTable[] | [] {
    if (isTrainError(liveTrainData)) return [] // exit early and return an empty array in case of a TrainError
    let stationStopData: TimeTable[] = [];

    liveTrainData.forEach(train => {
        // Filter trains so that only trains where station and journey type match (e.g. arrival or destination) AND the train stops at the location
        const filteredRows = train.timeTableRows.filter(row => {
            const matchesStationAndDestination =
                row.stationShortCode === stationShortCode &&
                row.type === destinationType &&
                row.trainStopping === true;

            const matchesFinalStationShortCode = finalStationShortCode ?
                train.timeTableRows.some(tr => tr.stationShortCode === finalStationShortCode) :
                true;

            return matchesStationAndDestination && matchesFinalStationShortCode;
        });

        const trainJourney = train.timeTableRows
            .filter((row) => {
                const isNonStopping = row.trainStopping === true && row.commercialStop === true;
                return isNonStopping;
            })
            .map((row) => {
                const station = stationMetadata.find(metadata => metadata.stationShortCode === row.stationShortCode);
                return {
                    ...row,
                    stationName: station ? sanitizeStationName(station.stationName) : row.stationShortCode
                };
            });

        // Map to TimeTable structure
        const transformedRows = filteredRows.map(row => {
            // Get the last timetable row to find the final destination stationName
            const lastRow = destinationType === 'ARRIVAL' ? train.timeTableRows[0] : train.timeTableRows[train.timeTableRows.length - 1];
            const finalDestinationData = finalStationShortCode ?
                stationMetadata.find(code => code.stationShortCode === finalStationShortCode) :
                stationMetadata.find(code => code.stationShortCode === lastRow.stationShortCode);

            const stationData = stationMetadata.find(station => station.stationShortCode === stationShortCode);
            const latitude = stationData ? stationData.latitude : undefined;
            const longitude = stationData ? stationData.longitude : undefined;

            return {
                stationName: finalDestinationData ? sanitizeStationName(finalDestinationData.stationName) : "", // Use the last station name or default
                departureLatitude: latitude,
                departureLongitude: longitude,
                type: row.type,
                scheduledTime: row.scheduledTime,
                liveEstimateTime: row.liveEstimateTime,
                unknownDelay: row.unknownDelay,
                scheduledFinalDestination: finalDestinationData ? lastRow.scheduledTime : "",
                trainType: train.trainType,
                trainNumber: train.trainNumber,
                differenceInMinutes: row.differenceInMinutes,
                commercialTrack: row.commercialTrack,
                cancelled: row.cancelled,
                trainJourney: trainJourney
            };
        });
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