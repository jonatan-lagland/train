'use client'
import { StationMetadataContext } from '@/lib/context/StationMetadataContext'
import React, { useContext, useEffect, useState } from 'react'
import { TimeTable, TrainDestination } from './timetable'
import fetchLiveTrain from '@/app/api/fetchLiveTrain'
import sanitizeStationName from '@/lib/utils/sanitizeStationName'
import { StationMetaData, Train, TrainError } from '@/lib/types'
import { isTrainError } from '@/lib/utils/liveTrainUtils'

type TimetableContainerProps = {
    liveTrainData: Train[] | TrainError | undefined
    liveDestinationTrainData: Train[] | undefined
    finalStationShortCode: string | undefined
    stationMetadata: StationMetaData[]
    stationShortCode: string | undefined
    destination: TrainDestination
}


function TimetableContainer({ liveTrainData, liveDestinationTrainData, finalStationShortCode, stationMetadata, stationShortCode, destination }: TimetableContainerProps) {
    let data = undefined;
    let transformedData: TimeTable[] = [];

    if (liveTrainData)
        data = liveTrainData
    if (liveDestinationTrainData)
        data = liveDestinationTrainData
    if (!data || isTrainError(data)) {
        return (
            <TimeTable data={transformedData} destination={destination} stationMetaData={stationMetadata}></TimeTable>
        )
    }

    data.forEach(train => {
        // Filter trains so that only trains where station and journey type match (e.g. arrival or destination) AND the train stops at the location
        const filteredRows = train.timeTableRows.filter(row => {
            const matchesStationAndDestination =
                row.stationShortCode === stationShortCode &&
                row.type === destination &&
                row.trainStopping === true;

            const matchesFinalStationShortCode = finalStationShortCode ?
                train.timeTableRows.some(tr => tr.stationShortCode === finalStationShortCode) :
                true;

            return matchesStationAndDestination && matchesFinalStationShortCode;
        });

        // Map to TimeTable structure
        const transformedRows = filteredRows.map(row => {
            // Get the last timetable row to find the final destination stationName
            const lastRow = train.timeTableRows[train.timeTableRows.length - 1];
            const finalDestinationData = finalStationShortCode ?
                stationMetadata.find(code => code.stationShortCode === finalStationShortCode) :
                stationMetadata.find(code => code.stationShortCode === lastRow.stationShortCode);

            return {
                stationName: finalDestinationData ? sanitizeStationName(finalDestinationData.stationName) : "", // Use the last station name or default
                type: row.type,
                scheduledTime: row.scheduledTime,
                scheduledFinalDestination: finalDestinationData ? lastRow.scheduledTime : "",
                trainType: train.trainType,
                trainNumber: train.trainNumber,
                differenceInMinutes: row.differenceInMinutes,
                commercialTrack: row.commercialTrack
            };
        });

        transformedData = transformedData.concat(transformedRows);
    });

    return (
        <TimeTable data={transformedData} destination={destination}></TimeTable>
    )
}

export default TimetableContainer