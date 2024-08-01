'use client'
import { TimeTable, TrainDestination } from "../table/timetable"
import { useTranslations } from "next-intl"
import { SiteLocale } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import LinkIcon from '@mui/icons-material/Link';

type ArrivalTimestampProps = {
    city: string
    destinationType: TrainDestination
    locale: SiteLocale
    stationNextTimestamp: string
    stationNextTrainTrack: number
    timeStampNow: number
    data: TimeTable[]
    commuterLink: string | undefined
}

/**
 * Returns a localized banner that displays the station name, train number and a timestamp until the train's arrival.
 *
 * @param {ArrivalTimestampProps} props - The props object.
 * @param {string} props.city - City label.
 * @param {TrainDestination} props.destinationType - Whether the train is an arrival or destination train.
 * @param {string} props.stationNextTimestamp - Unix Timestamp of the next train arrival.
 * @param {number} props.stationNextTrainTrack - The train track of the next arriving train.
 * @param {TimeTable[]} props.data - Live train data, the length of which is evaluated.
 */
export default function ArrivalTimestamp({ city, destinationType, locale, stationNextTimestamp, stationNextTrainTrack, timeStampNow, data, commuterLink }: ArrivalTimestampProps): React.ReactElement {
    const translation = useTranslations('TimeTable');
    const decodedCity = decodeURIComponent(city);

    const calculateLocalizedLabel = useCallback(() => {
        const timeDifference = new Date(stationNextTimestamp).getTime() - timeStampNow;
        const totalMinutes = Math.max(Math.ceil(timeDifference / 60000), 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const travelTimeLabel = hours > 0
            ? `${hours} ${translation('longHour')} ${minutes} ${translation('longMin')}`
            : `${minutes} ${translation('longMin')}`;

        switch (locale) {
            case "se":
                return <>{destinationType === 'ARRIVAL' ? 'Anländer till' : 'Avgår från'} <span className="capitalize">{decodedCity}</span> station om <span className='font-bold'>{travelTimeLabel}</span> {destinationType === 'ARRIVAL' ? 'på spår ' : 'från spår '} <span>{stationNextTrainTrack}</span>.</>;
            case "en":
                return <>{destinationType === 'ARRIVAL' ? 'Arrives at ' : 'Departs from '} <span className="capitalize">{decodedCity}</span> station in <span className='font-bold'>{travelTimeLabel}</span> {destinationType === 'ARRIVAL' ? 'on track ' : 'from track '} <span>{stationNextTrainTrack}</span>.</>;
            default:
                return <>{destinationType === 'ARRIVAL' ? 'Saapuu ' : 'Lähtee '} <span className="capitalize">{decodedCity}</span> {destinationType === 'ARRIVAL' ? 'asemalle ' : 'asemalta '} <span className='font-bold'>{travelTimeLabel}</span> kuluttua {destinationType === 'ARRIVAL' ? 'raiteelle ' : 'raiteelta '} <span>{stationNextTrainTrack}</span>.</>;
        }
    }, [stationNextTimestamp, timeStampNow, translation, locale, destinationType, decodedCity, stationNextTrainTrack]);

    const [localizedLabel, setLocalizedLabel] = useState<JSX.Element>(calculateLocalizedLabel);

    useEffect(() => {
        setLocalizedLabel(calculateLocalizedLabel());
    }, [calculateLocalizedLabel]);

    return (
        <span className='font-medium text-xl text-slate-600'>
            {data.length === 0 ?
                <div className="flex flex-col gap-2">
                    <span>{translation('noJourneyFound')}</span>
                    {commuterLink ? <Link className="flex flex-row items-end gap-1 underline text-blue-600" href={commuterLink}>{translation('commuteSuggestion')}</Link> : null}
                </div>
                : (
                    <>{localizedLabel}</>
                )}
        </span>
    );
}
