'use client';

import { StationMetadataContext } from "@/lib/context/StationMetadataContext";
import { ReactNode } from "react";
import { StationMetaData } from "@/lib/types";

type StaticDataProviderProps = {
    children: ReactNode;
    stationMetaData: StationMetaData[] | [];
}

export const StaticDataProvider = ({ children, stationMetaData }: StaticDataProviderProps) => {
    const filteredStations = stationMetaData
        ? stationMetaData.filter(
            (station) => station.passengerTraffic === true && station.type === "STATION"
        )
        : [];

    return (
        <StationMetadataContext.Provider value={filteredStations}>
            {children}
        </StationMetadataContext.Provider>
    );
};
