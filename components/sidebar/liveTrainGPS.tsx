"use client";

import fetchLiveTrainGPS from "@/app/api/fetchLiveTrainGPS";
import { TrainGPS } from "@/lib/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SpinnerMd, SpinnerSm } from "../ui/spinner";
import { useTranslations } from "next-intl";
export const MapView = dynamic(
    () => import("./mapView")
        // this part is needed if your use a named export
        // you can replace by ".default" when using a default export
        .then((mod) => mod.default),
    {
        // This prevents server-side rendering of BrowserComponent
        ssr: false
    }
);

type LiveTrainGPSProps = {
    stationNextTrainNumber: number
};

const LiveTrainGPS = ({ stationNextTrainNumber }: LiveTrainGPSProps) => {
    const [data, setData] = useState<TrainGPS[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);
    const width = "100%";
    const height = "30vh";
    const translation = useTranslations('TimeTable');
    const trainNumber = translation('trainNumber');
    const trainSpeed = translation('trainSpeed');
    const trainAccuracy = translation('trainAccuracy');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchLiveTrainGPS(stationNextTrainNumber);
                setData(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(); // Fetch immediately on component mount
        const intervalId = setInterval(fetchData, 6000); // Fetch every 6 seconds

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, [stationNextTrainNumber]);

    return (
        <div className="border" style={{ width, height }}>
            {isLoading ? (
                <div className="flex items-center justify-center backdrop-brightness-90" style={{ width, height }}>
                    <SpinnerMd></SpinnerMd>
                </div>
            ) : (
                <MapView trainNumber={trainNumber} trainSpeed={trainSpeed} trainAccuracy={trainAccuracy} data={data} width={width} height={height}></MapView>
            )}
        </div>
    );
};

export default LiveTrainGPS;
