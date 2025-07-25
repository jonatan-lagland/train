"use client";

import fetchLiveTrainGPS from "@/app/api/fetchLiveTrainGPS";
import { TrainGPS } from "@/lib/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SpinnerMd } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { NextStationDataProps } from "@/lib/utils/sortedStationData";
export const MapView = dynamic(() => import("./mapView").then((mod) => mod.default), {
  ssr: false,
});

type LiveTrainGPSProps = {
  nextStation: NextStationDataProps;
};

const LiveTrainGPS = ({ nextStation }: LiveTrainGPSProps) => {
  const { departureLatitude, departureLongitude, stationNextTrainNumber } = nextStation;
  const [data, setData] = useState<TrainGPS[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const width = "100%";
  const height = "30vh";
  const translation = useTranslations("TimeTable");
  const trainNumberLabel = translation("trainNumber");
  const trainSpeedLabel = translation("trainSpeed");

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

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="border" onPointerDown={handlePointerDown} style={{ width, height }}>
      {isLoading ? (
        <div className="flex items-center justify-center backdrop-brightness-90" style={{ width, height }}>
          <SpinnerMd></SpinnerMd>
        </div>
      ) : (
        <MapView
          trainNumberLabel={trainNumberLabel}
          trainSpeedLabel={trainSpeedLabel}
          departureLatitude={departureLatitude}
          departureLongitude={departureLongitude}
          data={data}
          width={width}
          height={height}
        ></MapView>
      )}
    </div>
  );
};

export default LiveTrainGPS;
