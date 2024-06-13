'use client'
import { StationMetadataContext } from '@/lib/context/StationMetadataContext'
import React, { useContext, useEffect, useState } from 'react'
import { TimeTable, TrainDestination } from './timetable'
import fetchLiveTrain from '@/app/api/fetchLiveTrain'
import sanitizeStationName from '@/lib/utils/sanitizeStationName'
import { StationMetaData, Train } from '@/lib/types'

type TimetableContainerProps = {
    liveTrainData: Train[]
    finalStationShortCode: string | undefined
    stationMetadata: StationMetaData[]
    stationShortCode: string
    destination: TrainDestination
}

function transformTrainData(liveTrainData, finalStationShortCode, stationMetadata, stationShortCode, destination): TimeTable[] {
    let result: TimeTable[] = [];

    liveTrainData.forEach(train => {
        // Filter the timeTableRows that match the criteria for the current station
        const filteredRows = train.timeTableRows.filter(row => {
            const matchesStationAndDestination = row.stationShortCode === stationShortCode &&
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

        result = result.concat(transformedRows);
    });


    return result;
}


function TimetableContainer({ liveTrainData, finalStationShortCode, stationMetadata, stationShortCode, destination }: TimetableContainerProps) {

    const transformedData = transformTrainData(liveTrainData, finalStationShortCode, stationMetadata, stationShortCode, destination);

    return (
        <TimeTable data={transformedData} destination={destination} stationMetaData={stationMetadata}></TimeTable>
    )
}

export default TimetableContainer