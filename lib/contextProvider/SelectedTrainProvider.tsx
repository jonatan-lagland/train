'use client';

import { ReactNode, useState } from "react";
import { SelectedTrainContext } from "../context/SelectedTrainContext";

type StaticDataProviderProps = {
    children: ReactNode;
}

export const SelectedTrainProvider = ({ children }: StaticDataProviderProps) => {
    const [trainNumber, setTrainNumber] = useState<number | undefined>(undefined);

    return (
        <SelectedTrainContext.Provider value={{ trainNumber, setTrainNumber }}>
            {children}
        </SelectedTrainContext.Provider>
    );
};