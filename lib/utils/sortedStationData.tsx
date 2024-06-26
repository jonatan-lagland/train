'use client'
import { TimeTable } from '@/components/table/timetable';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState, useEffect } from 'react';

type NextStationDataProps = {
    stationNextName: string;
    stationNextTimestamp: string;
    stationNextTrainType: string;
    stationNextTrainNumber: number;
    stationNextTrainTrack: number;
};

/**
 * Hook that takes in train data and sorts it by scheduledTime and returns the latest train by default. 
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
    const initialSortedData = [...data].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    const [nextStationData, setNextStationData] = useState({
        stationNextName: initialSortedData[0]?.stationName,
        stationNextTimestamp: initialSortedData[0]?.scheduledTime,
        stationNextTrainType: initialSortedData[0]?.trainType,
        stationNextTrainNumber: initialSortedData[0]?.trainNumber,
        stationNextTrainTrack: initialSortedData[0]?.commercialTrack,
    });
    useEffect(() => {
        const sortedData = [...data].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

        let isStaleData = true;
        for (let i = 0; i < sortedData.length; i++) {
            const currentTimestamp = new Date(sortedData[i].scheduledTime).getTime();
            if (currentTimestamp > timeStampNow) {
                setNextStationData({
                    stationNextName: sortedData[i]?.stationName,
                    stationNextTimestamp: sortedData[i]?.scheduledTime,
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
