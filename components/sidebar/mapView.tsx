"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TrainRounded } from "@mui/icons-material";
import L from "leaflet";
import ReactDOMServer from 'react-dom/server';
import { TrainGPS } from "@/lib/types";

type MapViewProps = {
    trainNumber: string
    trainSpeed: string
    trainAccuracy: string
    data: TrainGPS[] | []
    width: string
    height: string
}


export default function MapView({ trainNumber, trainSpeed, trainAccuracy, data, width, height }: MapViewProps) {
    const defaultPosition: [number, number] = [60, 25]; // Default coordinates (e.g., central Finland)
    const position: [number, number] = (data.length > 0 && data[0]?.location?.coordinates)
        ? [data[0].location.coordinates[1], data[0].location.coordinates[0]]
        : defaultPosition;

    const trainIconString = ReactDOMServer.renderToString(<TrainRounded sx={{ fontSize: 5 }} />);
    const trainIcon = new L.DivIcon({
        html: `<div style="fill: #2d4f06;">${trainIconString}</div>`,
        className: '', // Add custom className if you want to style the icon further
        iconSize: [30, 30], // Adjust size as necessary
        iconAnchor: [15, 15], // Center the icon (half of iconSize)
    });

    return (
        <MapContainer center={position} zoom={7} style={{ width, height }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.length > 0 && data.map((train, index) => (
                <Marker
                    key={index}
                    position={[train.location.coordinates[1], train.location.coordinates[0]]}
                    icon={trainIcon}
                >
                    <Popup>
                        <span className="font-bold">{trainNumber}:</span> {train.trainNumber} <br />
                        <span className="font-bold">{trainSpeed}:</span> {train.speed} km/h <br />
                        <span className="font-bold">{trainAccuracy}:</span> {train.accuracy ? train.accuracy : "N/A"} m
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
