import sanitizeStationName from './sanitizeStationName';
import fetchLiveTrain from '@/app/api/fetchLiveTrain';
import { StationMetaData, Train, TrainError } from '../types';
import { TimeTable, TrainDestination } from '@/components/table/timetable';
import fetchLiveDestinationTrain from '@/app/api/fetchLiveDestinationTrain';


export default async function liveTrainUtils(city: string, cityDestination: string, destinationType: TrainDestination, stationMetadata: StationMetaData[]) {
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
        liveTrainData = await fetchLiveTrain({ stationShortCode: stationShortCode, type: destinationType });
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

    liveTrainData = await fetchLiveDestinationTrain({ departure_station: stationShortCode, arrival_station: finalStationShortCode });
    return {
        liveTrainData,
        stationShortCode,
        finalStationShortCode
    };
}

export function useTransformTrainData(
    liveTrainData: Train[] | TrainError,
    finalStationShortCode: string | undefined,
    stationMetadata: StationMetaData[],
    stationShortCode: string | undefined,
    destinationType: TrainDestination
) {
    if (isTrainError(liveTrainData)) return [] // exit early and return an empty array in case of a TrainError
    let transformedData: TimeTable[] = [];

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

        // Map to TimeTable structure
        const transformedRows = filteredRows.map(row => {
            // Get the last timetable row to find the final destination stationName
            const lastRow = destinationType === 'ARRIVAL' ? train.timeTableRows[0] : train.timeTableRows[train.timeTableRows.length - 1];
            const finalDestinationData = finalStationShortCode ?
                stationMetadata.find(code => code.stationShortCode === finalStationShortCode) :
                stationMetadata.find(code => code.stationShortCode === lastRow.stationShortCode);

            return {
                stationName: finalDestinationData ? sanitizeStationName(finalDestinationData.stationName) : "", // Use the last station name or default
                type: row.type,
                scheduledTime: row.scheduledTime,
                liveEstimateTime: row.liveEstimateTime,
                unknownDelay: row.unknownDelay,
                scheduledFinalDestination: finalDestinationData ? lastRow.scheduledTime : "",
                trainType: train.trainType,
                trainNumber: train.trainNumber,
                differenceInMinutes: row.differenceInMinutes,
                commercialTrack: row.commercialTrack,
                cancelled: row.cancelled
            };
        });

        transformedData = transformedData.concat(transformedRows);
    });

    return transformedData;
}



/**
 * A TypeScript type guard function that validates whether data is of type Train or TrainError.

 * @param {Train[] | TrainError} data - An array of objects containing train data, or an object containing an error message.
 * @returns {boolean} True in case of an error message and false in case of no error message.
 */
export function isTrainError(data: Train[] | TrainError): data is TrainError {
    return (data as TrainError).errorMessage !== undefined;
}