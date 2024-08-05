"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TrainRounded } from "@mui/icons-material";
import L from "leaflet";
import ReactDOMServer from 'react-dom/server';
import { TrainGPS } from "@/lib/types";
import { MutableRefObject, RefObject, useEffect, useMemo, useRef, useState } from "react";

type MapViewProps = {
    trainNumberLabel: string
    trainSpeedLabel: string
    departureLatitude: number | undefined
    departureLongitude: number | undefined
    data: TrainGPS[] | []
    width: string
    height: string
}

type MarkerPositionProps = {
    position: [number, number]
    trainIcon: L.DivIcon
    data: TrainGPS[] | []
    trainSpeedLabel: string
    trainNumberLabel: string
}

const animateMarker = (
    markerRef: RefObject<L.Marker<any>>,
    currentPosition: MutableRefObject<[number, number]>,
    position: [number, number],
    animationRef: MutableRefObject<null | number>
) => {
    const start = currentPosition.current;
    const end = position;
    const duration = 3000; // duration of animation in ms
    const startTime = performance.now();

    const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animate = () => {
        const now = performance.now();
        const elapsed = (now - startTime) / duration;
        const progress = easeInOutQuad(Math.min(elapsed, 1));

        const lat = start[0] + (end[0] - start[0]) * progress;
        const lng = start[1] + (end[1] - start[1]) * progress;

        markerRef.current?.setLatLng([lat, lng]);

        if (elapsed < 1) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            currentPosition.current = end;
            animationRef.current = null;
        }
    };
    animationRef.current = requestAnimationFrame(animate);
};

const MarkerPosition = ({ position, trainIcon, data, trainSpeedLabel, trainNumberLabel }: MarkerPositionProps) => {
    const map = useMap();
    const markerRef = useRef<L.Marker<any>>(null);
    const currentPosition = useRef(position);
    const previousTrainNumber: MutableRefObject<null | number> = useRef(null);
    const trainNumber = data[0]?.trainNumber;

    useEffect(() => {
        // Instantly snap map and marker to new position
        if (markerRef.current) {
            markerRef.current.setLatLng(position);
        }
        // Re-adjust map if train number changes
        if (previousTrainNumber.current !== trainNumber) {
            map.setView(position, 7, { animate: true });
        }
        currentPosition.current = position;
        previousTrainNumber.current = trainNumber;
    }, [map, position, trainNumber]);

    return (
        <>
            {data.length > 0 && data.map((train) => (
                <Marker
                    ref={markerRef}
                    key={train.trainNumber}
                    position={position}
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => {
                            map.setView(position, 10, { animate: true })
                        }
                    }}
                >
                    <Popup>
                        <span className="font-bold">{trainNumberLabel}:</span> {train.trainNumber} <br />
                        <span className="font-bold">{trainSpeedLabel}:</span> {train.speed} km/h <br />
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default function MapView({ trainNumberLabel, trainSpeedLabel, data, width, height, departureLatitude = 60.1699, departureLongitude = 24.9384 }: MapViewProps) {
    /* Values are memoized as to not re-render the icon with every coordinate change and keep the pulsating effect constant */
    const defaultPosition: [number, number] = useMemo(() =>
        [departureLatitude, departureLongitude],
        [departureLatitude, departureLongitude]); // Has Helsinki station coordinates as a fallback
    const position: [number, number] = useMemo(() => {
        return data.length > 0 && data[0]?.location?.coordinates
            ? [data[0].location.coordinates[1], data[0].location.coordinates[0]]
            : defaultPosition;
    }, [data, defaultPosition]);

    const trainIcon = useMemo(() => {
        const trainIconString = ReactDOMServer.renderToString(
            <TrainRounded style={{ width: 30, height: 30, fill: '#192e02' }} />
        );
        return new L.DivIcon({
            html: `
                <div class="train-icon-container">
                    <div class="train-icon-content">
                        ${trainIconString}
                    </div>
                    <div class="pulsating-background"></div>
                </div>
            `,
            className: '',
            iconSize: [60, 60],
            iconAnchor: [30, 30],
        });
    }, []);

    return (
        <MapContainer
            center={position}
            zoom={10}
            style={{ width, height }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerPosition
                position={position}
                trainIcon={trainIcon}
                data={data}
                trainNumberLabel={trainNumberLabel}
                trainSpeedLabel={trainSpeedLabel}
            />
        </MapContainer>
    );
}
