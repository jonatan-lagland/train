import sanitizeStationName from './sanitizeStationName';
import fetchLiveTrain from '@/app/api/fetchLiveTrain';
import { StationMetaData, TimeTable, TimeTableRow, Train, TrainDestination, TrainError } from '../types';
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
        const lastRow = destinationType === 'ARRIVAL' ? train.timeTableRows[0] : train.timeTableRows[train.timeTableRows.length - 1];
        const destinationRow = train.timeTableRows.find(row =>
            row.stationShortCode === finalStationShortCode && row.type === 'ARRIVAL'
        );
        const finalDestinationData = finalStationShortCode ?
            stationMetadata.find(code => code.stationShortCode === finalStationShortCode) :
            stationMetadata.find(code => code.stationShortCode === lastRow.stationShortCode);

        const stationData = stationMetadata.find(station => station.stationShortCode === stationShortCode);
        const latitude = stationData ? stationData.latitude : undefined;
        const longitude = stationData ? stationData.longitude : undefined;

        // Filter trains so that only trains where station and journey type match (e.g. arrival or destination) AND the train stops at the location
        const filteredRows = train.timeTableRows.filter(row => {
            const matchesStationAndDestination =
                row.stationShortCode === stationShortCode &&
                row.type === destinationType &&
                row.trainStopping === true;
            return matchesStationAndDestination;
        });

        // The entire journey a train goes through and all stations the train stops at
        const trainJourney = train.timeTableRows
            .filter((row) => {
                // Check for a predetermined destination and exclude stations past that point
                if (destinationRow) {
                    return row.trainStopping === true && row.commercialStop === true && row.scheduledTime <= destinationRow?.scheduledTime;
                }
                return row.trainStopping === true && row.commercialStop === true;
            })
            .map((row) => {
                const station = stationMetadata.find(metadata => metadata.stationShortCode === row.stationShortCode);
                return {
                    ...row,
                    stationName: station ? sanitizeStationName(station.stationName) : row.stationShortCode
                };
            });

        const transformedRows = [] as TimeTable[]

        for (const row of filteredRows) {
            transformedRows.push({
                stationName: finalDestinationData ? sanitizeStationName(finalDestinationData.stationName) : "", // Use the last station name or default
                departureLatitude: latitude as number,
                departureLongitude: longitude as number,
                type: row.type,
                scheduledTime: row.scheduledTime,
                liveEstimateTime: row.liveEstimateTime,
                unknownDelay: row.unknownDelay,
                scheduledFinalDestination: destinationRow ? destinationRow.liveEstimateTime ? destinationRow.liveEstimateTime : destinationRow.scheduledTime : lastRow.liveEstimateTime ? lastRow.liveEstimateTime : lastRow.scheduledTime,
                trainType: train.trainType,
                trainNumber: train.trainNumber,
                differenceInMinutes: row.differenceInMinutes,
                commercialTrack: row.commercialTrack as string,
                cancelled: row.cancelled,
                trainJourney: trainJourney as unknown as []
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