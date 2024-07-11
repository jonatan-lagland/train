import { StaticDataProvider } from "@/lib/contextProvider/StaticDataProvider";
import "./globals.css";
import { ReactNode } from 'react';
import fetchStationMetadata from "./api/fetchStationMetadata";

type Props = {
    children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
    const stationMetadata = await fetchStationMetadata();

    return (
        <StaticDataProvider stationMetadata={stationMetadata}>
            {children}
        </StaticDataProvider>
    );
}