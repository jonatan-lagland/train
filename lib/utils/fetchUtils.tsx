'use client'

import fetchLiveTrain from "@/app/api/fetchLiveTrain";
import { Train, TrainError } from "../types";
import fetchLiveDestinationTrain from "@/app/api/fetchLiveDestinationTrain";
import { TrainDestination } from "@/components/table/timetable";
import { useCallback, useEffect, useState } from "react";

export default function useLiveTrainData(
    cityDestination: string,
    destinationType: TrainDestination,
    data: Train[] | TrainError,
    stationShortCode: string,
    finalStationShortCode: string
) {
    const [liveTrainData, setLiveTrainData] = useState({ liveTrainData: data, stationShortCode: stationShortCode, finalStationShortCode: finalStationShortCode });

    useEffect(() => {
        const fetchData = async () => {
            let liveTrainData: Train[] | TrainError;

            /* If no destination has been defined, fetch and return a station with no pre-defined destination */
            if (!cityDestination) {
                liveTrainData = await fetchLiveTrain({ stationShortCode: stationShortCode, type: destinationType });
                setLiveTrainData({
                    liveTrainData,
                    stationShortCode,
                    finalStationShortCode
                });
                return;
            }
            if (!finalStationShortCode) {
                throw new Error(`Destination station not found for city: ${cityDestination}`);
            }

            liveTrainData = await fetchLiveDestinationTrain({ departure_station: stationShortCode, arrival_station: finalStationShortCode });
            setLiveTrainData({
                liveTrainData,
                stationShortCode,
                finalStationShortCode
            });
            return;
        };

        fetchData(); // Fetch data immediately
        const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [cityDestination, destinationType, finalStationShortCode, stationShortCode]);

    return { liveTrainData };
}