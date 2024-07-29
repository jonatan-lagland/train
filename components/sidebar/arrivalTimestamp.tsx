'use client'
import { TimeTable, TrainDestination } from "../table/timetable"
import { useTranslations } from "next-intl"
import { SiteLocale } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"

type ArrivalTimestampProps = {
    city: string
    destinationType: TrainDestination
    locale: SiteLocale
    stationNextTimestamp: string
    stationNextTrainTrack: number
    timeStampNow: number
    data: TimeTable[]
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
export default function ArrivalTimestamp({ city, destinationType, locale, stationNextTimestamp, stationNextTrainTrack, timeStampNow, data }: ArrivalTimestampProps): React.ReactElement {
    const translation = useTranslations('TimeTable');
    const decodedCity = decodeURIComponent(city);

    // Function to calculate travel time, wrapped in useCallback
    const calculateTravelTime = useCallback(() => {
        const timeDifference = new Date(stationNextTimestamp).getTime() - new Date(timeStampNow).getTime();
        const totalMinutes = Math.max(Math.ceil(timeDifference / 60000), 0); // Ensure the value is not negative with Math.max
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return hours > 0
            ? `${hours} ${translation('longHour')} ${minutes} ${translation('longMin')}`
            : `${minutes} ${translation('longMin')}`;
    }, [stationNextTimestamp, timeStampNow, translation]);

    // State to manage travel time, initial state set using the calculation function
    const [travelTime, setTravelTime] = useState<string>(calculateTravelTime);

    /*
        * NOTE:
        * useEffect is used here because the timestamp rendered on the server is sometimes different
        * from the one on the client if a minute passes during the time the client is rendered,
        * which causes a hydration error.
    */
    useEffect(() => {
        // Update the travel time dynamically after the component mounts
        setTravelTime(calculateTravelTime());
    }, [calculateTravelTime, stationNextTimestamp, timeStampNow, translation]);

    /* Used due to a variation in word order */
    const translated = () => {
        switch (locale) {
            case "se":
                return <>{destinationType === 'ARRIVAL' ? 'Anländer till' : 'Avgår från'} <span className="capitalize">{decodedCity}</span> station om <span className='font-bold'>{travelTime}</span> {destinationType === 'ARRIVAL' ? 'på spår ' : 'från spår '} <span>{stationNextTrainTrack}</span>.</>;
            case "en":
                return <>{destinationType === 'ARRIVAL' ? 'Arrives at ' : 'Departs from '} <span className="capitalize">{decodedCity}</span> station in <span className='font-bold'>{travelTime}</span> {destinationType === 'ARRIVAL' ? 'on track ' : 'from track '} <span>{stationNextTrainTrack}</span>.</>;
            default:
                return <>{destinationType === 'ARRIVAL' ? 'Saapuu ' : 'Lähtee '} <span className="capitalize">{decodedCity}</span> {destinationType === 'ARRIVAL' ? 'asemalle ' : 'asemalta '} <span className='font-bold'>{travelTime}</span> kuluttua {destinationType === 'ARRIVAL' ? 'raiteelle ' : 'raiteelta '} <span>{stationNextTrainTrack}</span>.</>;
        }
    };

    return (
        <span className='font-medium text-xl text-slate-600'>
            {data.length === 0 ? <span>{translation('noJourneyFound')}</span> : (
                <>{translated()}</>
            )}
        </span>
    );

}
