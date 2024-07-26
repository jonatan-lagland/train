'use client'
import { TimeTable } from '@/components/table/timetable';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState, useEffect } from 'react';

export type NextStationDataProps = {
    stationNextName: string;
    departureLatitude: number | undefined
    departureLongitude: number | undefined
    stationNextTimestamp: string;
    stationNextTrainType: string;
    stationNextTrainNumber: number;
    stationNextTrainTrack: number;
};

/**
 * Hook that takes in train data and sorts it by scheduledTime and returns the latest train by default.
 * If liveEstimateData exists, use that instead.
 * Has a side effect that compares the current time to timestamps in the timetable data. If a train has already arrived,
 * return the next train's data from the array. If all of the data is stale, meaning all trains have passsed,
 * cause a refresh of the page in an attempt to re-fetch data.
 *
 * @export
 * @param {TimeTable[]} data - An array of train data.
 * @param {number} timeStampNow - The current timestamp in Unix format.
 * @param {AppRouterInstance} router - An instance of the Next.js App router used to refresh the page in the event of stale data.
 * @returns {NextStationDataProps}
 */
export default function useSortedStationData(data: TimeTable[], timeStampNow: number, router: AppRouterInstance): NextStationDataProps {
    // Sorting data based on available liveEstimateTime or scheduledTime
    const initialSortedData = [...data].sort((a, b) => {
        const timeA = a.liveEstimateTime ? new Date(a.liveEstimateTime).getTime() : new Date(a.scheduledTime).getTime();
        const timeB = b.liveEstimateTime ? new Date(b.liveEstimateTime).getTime() : new Date(b.scheduledTime).getTime();
        return timeA - timeB;
    });

    // Initialize state with the first sorted station data
    const [nextStationData, setNextStationData] = useState({
        stationNextName: initialSortedData[0]?.stationName,
        departureLatitude: initialSortedData[0]?.departureLatitude,
        departureLongitude: initialSortedData[0]?.departureLongitude,
        stationNextTimestamp: initialSortedData[0]?.liveEstimateTime || initialSortedData[0]?.scheduledTime,
        stationNextTrainType: initialSortedData[0]?.trainType,
        stationNextTrainNumber: initialSortedData[0]?.trainNumber,
        stationNextTrainTrack: initialSortedData[0]?.commercialTrack,
    });

    useEffect(() => {
        const sortedData = [...data].sort((a, b) => {
            const timeA = a.liveEstimateTime ? new Date(a.liveEstimateTime).getTime() : new Date(a.scheduledTime).getTime();
            const timeB = b.liveEstimateTime ? new Date(b.liveEstimateTime).getTime() : new Date(b.scheduledTime).getTime();
            return timeA - timeB;
        });

        let isStaleData = true;
        for (let i = 0; i < sortedData.length; i++) {
            const currentTimestamp = sortedData[i].liveEstimateTime
                ? new Date(sortedData[i].liveEstimateTime ?? 0).getTime()  // Provide a default value of 0
                : new Date(sortedData[i].scheduledTime ?? 0).getTime();    // Provide a default value of 0

            if (currentTimestamp > timeStampNow) {
                setNextStationData({
                    stationNextName: sortedData[i]?.stationName,
                    departureLatitude: sortedData[i]?.departureLatitude,
                    departureLongitude: sortedData[i]?.departureLongitude,
                    stationNextTimestamp: sortedData[i]?.liveEstimateTime || sortedData[i]?.scheduledTime,
                    stationNextTrainType: sortedData[i]?.trainType,
                    stationNextTrainNumber: sortedData[i]?.trainNumber,
                    stationNextTrainTrack: sortedData[i]?.commercialTrack,
                });
                isStaleData = false;
                break;
            }
        }
        if (isStaleData && sortedData.length > 0) {
            router.refresh();
        }
    }, [timeStampNow, data, router]);

    return nextStationData;
}
