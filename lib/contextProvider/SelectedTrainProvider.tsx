'use client';

import { ReactNode, useRef, useState } from "react";
import { SelectedTrainContext } from "../context/SelectedTrainContext";

type StaticDataProviderProps = {
    children: ReactNode;
}

export const SelectedTrainProvider = ({ children }: StaticDataProviderProps) => {
    const [selectedTrainNumber, setTrainNumber] = useState<number | undefined>(undefined);
    const sidebarRef = useRef<HTMLDivElement>(null);

    return (
        <SelectedTrainContext.Provider value={{ selectedTrainNumber, setTrainNumber, sidebarRef }}>
            {children}
        </SelectedTrainContext.Provider>
    );
};