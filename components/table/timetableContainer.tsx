'use client'
import { StationMetadataContext } from '@/lib/context/StationMetadataContext'
import React, { useContext, useEffect, useState } from 'react'
import { TimeTable, TrainDestination } from './timetable'
import { BannerLabel } from '@/app/[locale]/[city]/page'
import fetchLiveTrain from '@/app/api/fetchLiveTrain'
import { Train } from '@/lib/types'

type TimetableContainerProps = {
    destination: TrainDestination
    city: string
}

function transformTrainData(trains: any[], stationMetaData: { stationName: string; stationShortCode: string; }[], stationShortCode: string, destination: string): TimeTable[] {
    let result: TimeTable[] = [];

    trains.forEach(train => {
        // Filter the timeTableRows that match the criteria for the current station
        const filteredRows = train.timeTableRows.filter(row =>
            row.stationShortCode === stationShortCode &&
            row.type === destination &&
            row.trainStopping === true
        );

        // Map to TimeTable structure
        const transformedRows = filteredRows.map(row => {
            // Get the last timetable row to find the final destination stationName
            const lastRow = train.timeTableRows[train.timeTableRows.length - 1];
            const finalDestinationData = stationMetaData.find(code => code.stationShortCode === lastRow.stationShortCode);

            return {
                stationName: finalDestinationData ? finalDestinationData.stationName
                    // Remove "asema" when preceded by a space or at the start
                    .replace(/(^|\s)asema\b/gi, "")
                    // Replace underscores with spaces
                    .replace(/_/g, " ")
                    .trim() // Remove leading/trailing spaces 
                    : "", // Use the last station name or default
                type: row.type,
                scheduledTime: row.scheduledTime,
                trainType: train.trainType,
                trainNumber: train.trainNumber,
                differenceInMinutes: row.differenceInMinutes
            };
        });

        result = result.concat(transformedRows);
    });

    return result;
}


function TimetableContainer({ destination, city }: TimetableContainerProps) {
    const stationMetaData = useContext(StationMetadataContext)
    const decodedStation = decodeURIComponent(city.toLowerCase());
    const station = stationMetaData.find(code => decodedStation === code.stationName.toLowerCase().replace(/(^|\s)asema\b/gi, "").replace(/_/g, " ").trim());
    const stationShortCode = station ? station.stationShortCode : undefined;
    const [liveTrainData, setLiveTrainData] = useState<TimeTable[]>([]);

    useEffect(() => {
        const fetchLiveTrainData = async () => {
            if (!stationShortCode) {
                console.log(city)
                return;
            }
            try {
                const response = await fetchLiveTrain({ station: stationShortCode, type: destination });
                console.log(response);
                const transformedData = transformTrainData(response, stationMetaData, stationShortCode, destination);
                setLiveTrainData(transformedData);
            } catch (error) {
                console.error('Failed to fetch train data:', error);
            }
        };
        fetchLiveTrainData();
        //const intervalId = setInterval(fetchLiveTrainData, 30000); // Interval to re-fetch data every 30 seconds
        //return () => clearInterval(intervalId);

    }, [stationShortCode, destination, stationMetaData]);

    //console.log(data, liveTrainData)

    return (
        <TimeTable data={liveTrainData} destination={destination}></TimeTable>
    )
}

export default TimetableContainer