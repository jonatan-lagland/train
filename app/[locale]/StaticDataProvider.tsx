'use client';

import { StationMetadataContext } from "@/lib/context/StationMetadataContext";
import { ReactNode } from "react";
import { StationMetaData } from "@/lib/types";
import filterStationMetadata from "@/lib/utils/filterStationMetadata";

type StaticDataProviderProps = {
    children: ReactNode;
    stationMetadata: StationMetaData[];
}

export const StaticDataProvider = ({ children, stationMetadata }: StaticDataProviderProps) => {
    const filteredStations = filterStationMetadata(stationMetadata)

    return (
        <StationMetadataContext.Provider value={filteredStations}>
            {children}
        </StationMetadataContext.Provider>
    );
};
