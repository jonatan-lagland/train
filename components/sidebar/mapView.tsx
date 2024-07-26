"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TrainRounded } from "@mui/icons-material";
import L from "leaflet";
import ReactDOMServer from 'react-dom/server';
import { TrainGPS } from "@/lib/types";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

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

const MarkerPosition = ({ position, trainIcon, data, trainSpeedLabel, trainNumberLabel }: MarkerPositionProps) => {
    const map = useMap();
    const markerRef = useRef<L.Marker<any>>(null);
    const currentPosition = useRef(position);
    const previousTrainNumber: MutableRefObject<null | number> = useRef(null);

    // Used to track how many seconds until train should be focused on map
    const [countdown, setCountdown] = useState(0);

    // Interacting with the map grants a 15 second grace period where train won't be focused
    useMapEvents({
        dragstart() {
            setCountdown(15);
        },
        dragend() {
            setCountdown(15);
        }
    });

    // Focus map on train
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (countdown === 0 && map) {
            map.setView(position, map.getZoom(), { animate: true });
        }
    }, [map, position, countdown]);

    useEffect(() => {
        const animateMarker = () => {
            if (!markerRef.current) return;

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
                    requestAnimationFrame(animate);
                } else {
                    currentPosition.current = end;
                }
            };

            animate();
        };

        if (data.length === 0) return // Exit early in the event of no data

        const currentTrain = data[0];
        const currentTrainNumber = currentTrain.trainNumber;

        // Animate marker if the same train is still in focus
        if (previousTrainNumber.current === currentTrainNumber) {
            animateMarker();
            return;
        }

        // Train number has changed, set marker position immediately
        if (markerRef.current) {
            markerRef.current.setLatLng(position);
            setCountdown(0); // Immediately focus train
        }
        currentPosition.current = position; // Update current position
        previousTrainNumber.current = currentTrainNumber; // Update the previous train number

    }, [position, data]);


    return (
        <>
            {data.length > 0 && data.map((train) => (
                <Marker
                    ref={markerRef}
                    key={train.trainNumber}
                    position={[train.location.coordinates[1], train.location.coordinates[0]]}
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => {
                            map.setView(
                                [
                                    train.location.coordinates[1],
                                    train.location.coordinates[0]
                                ],
                                13
                            ),
                                setCountdown(0);
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
