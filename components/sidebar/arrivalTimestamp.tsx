'use client'
import { useEffect, useState } from "react"
import { TimeTable } from "../table/timetable"
import { useTranslations } from "next-intl"

type ArrivalTimestampProps = {
    stationNextTimestamp: string
    stationNextTrainTrack: number
    timeStampNow: number
    data: TimeTable[]
}

/**
 * Returns a timestamp that refreshes every 30 seconds.
 *
 * @param {ArrivalTimestampProps} props - The props object.
 * @param {string} props.stationNextTimestamp - Unix Timestamp of the next train arrival.
 * @param {number} props.stationNextTrainTrack - The train track of the next arriving train.
 * @param {TimeTable[]} props.data - Live train data, the length of which is determined.
 * @returns {React.ReactElement}
 */
export default function ArrivalTimestamp({ stationNextTimestamp, stationNextTrainTrack, timeStampNow, data }: ArrivalTimestampProps): React.ReactElement {
    const translation = useTranslations('TimeTable');
    const timeDifference = new Date(stationNextTimestamp).getTime() - new Date(timeStampNow).getTime();
    const totalMinutes = Math.max(Math.floor(timeDifference / 60000), 0); // Ensure the value is not negative with Math.max
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const travelTime = hours > 0
        ? `${hours} ${translation('longHour')} ${minutes} ${translation('longMin')}`
        : `${minutes} ${translation('longMin')}`;
    return (
        <span className='font-medium text-xl text-slate-400'>
            {data.length === 0 ? <span>{translation('noJourneyFound')}</span> : (
                <>Saapuu Tampere asemalle <span className='font-bold'>{travelTime}</span> kuluttua raiteelle <span>{stationNextTrainTrack}</span>.</>
            )}
        </span>
    )
}
