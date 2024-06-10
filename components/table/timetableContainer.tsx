'use client'
import { StationMetadataContext } from '@/lib/context/StationMetadataContext'
import React, { useContext, useEffect, useState } from 'react'
import { TimeTable, TrainDestination } from './timetable'
import fetchLiveTrain from '@/app/api/fetchLiveTrain'
import sanitizeStationName from '@/lib/utils/sanitizeStationName'

type TimetableContainerProps = {
    destination: TrainDestination
    city: string
}

function transformTrainData(trains: any[], finalStationShortCode: string | undefined, stationMetaData: { stationName: string; stationShortCode: string; }[], stationShortCode: string, destination: string): TimeTable[] {
    let result: TimeTable[] = [];

    trains.forEach(train => {
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
                stationMetaData.find(code => code.stationShortCode === finalStationShortCode) :
                stationMetaData.find(code => code.stationShortCode === lastRow.stationShortCode);

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


function TimetableContainer({ destination, city }: TimetableContainerProps) {
    const stationMetaData = useContext(StationMetadataContext)
    const decodedStation = decodeURIComponent(city.toLowerCase());
    const station = stationMetaData.find(code => decodedStation === sanitizeStationName(code.stationName.toLowerCase()));
    const stationShortCode = station ? station.stationShortCode : undefined;
    const [liveTrainData, setLiveTrainData] = useState<TimeTable[]>([]);
    const [finalStationShortCode, setFinalStationShortCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchLiveTrainData = async () => {
            if (!stationShortCode) {
                console.log(city)
                return;
            }
            try {
                const response = await fetchLiveTrain({ station: stationShortCode, type: destination });
                const transformedData = transformTrainData(response, finalStationShortCode, stationMetaData, stationShortCode, destination);
                console.log(transformedData);
                setLiveTrainData(transformedData);
            } catch (error) {
                console.error('Failed to fetch train data:', error);
            }
        };
        fetchLiveTrainData();
        //const intervalId = setInterval(fetchLiveTrainData, 30000); // Interval to re-fetch data every 30 seconds
        //return () => clearInterval(intervalId);

    }, [stationShortCode, destination, stationMetaData, city, finalStationShortCode]);




    return (
        <TimeTable data={liveTrainData} destination={destination} stationMetaData={stationMetaData}></TimeTable>
    )
}

export default TimetableContainer