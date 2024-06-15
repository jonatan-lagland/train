import React from 'react'
import sanitizeStationName from './sanitizeStationName';
import fetchLiveTrain from '@/app/api/fetchLiveTrain';
import { StationMetaData, Train, TrainError } from '../types';
import { TrainDestination } from '@/components/table/timetable';
import fetchLiveDestinationTrain from '@/app/api/fetchLiveDestinationTrain';

export default async function liveTrainUtils(
    city: string,
    cityDestination: string,
    destinationType: TrainDestination,
    stationMetadata: StationMetaData[]
) {
    const decodedStation = decodeURIComponent(city.toLowerCase());
    const station = stationMetadata.find(code => decodedStation === sanitizeStationName(code.stationName.toLowerCase()));
    const stationShortCode = station?.stationShortCode;
    let finalStationShortCode = undefined;

    if (cityDestination) {
        const destDecodedStation = decodeURIComponent(cityDestination.toLowerCase());
        const destStation = stationMetadata.find(code => destDecodedStation === sanitizeStationName(code.stationName.toLowerCase()));
        const destStationShortCode = destStation?.stationShortCode;
        const liveDestinationTrainData = await fetchLiveDestinationTrain({ departure_station: stationShortCode, arrival_station: destStationShortCode });
        finalStationShortCode = destStationShortCode;

        return (
            { liveDestinationTrainData, stationShortCode, finalStationShortCode }
        );
    }

    const liveTrainData = await fetchLiveTrain({ stationShortCode: stationShortCode, type: destinationType });
    return { liveTrainData, stationShortCode, finalStationShortCode };
}


/**
 * A TypeScript type guard function that validates whether data is of type Train or TrainError.

 * @param {Train[] | TrainError} data - An array of objects containing train data, or an object containing an error message.
 * @returns {boolean} True in case of an error message and false in case of no error message.
 */
export function isTrainError(data: Train[] | TrainError): data is TrainError {
    return (data as TrainError).errorMessage !== undefined;
}