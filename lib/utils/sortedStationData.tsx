'use client'
import { useState, useEffect } from 'react';

type TimeTable = {
    stationName: string;
    scheduledTime: string;
    trainType: string;
    trainNumber: number;
    commercialTrack: number;
};

export default function useSortedStationData(data: TimeTable[], timeStampNow: number) {
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
                break;
            }
        }
    }, [timeStampNow, data]);

    return nextStationData;
}
