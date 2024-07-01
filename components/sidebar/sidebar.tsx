'use client'
import React from 'react'
import { TimeTable, TrainDestination } from '../table/timetable'
import { useLocale, useTranslations } from 'next-intl'
import ArrivalTimestamp from './arrivalTimestamp'
import useSortedStationData from '@/lib/utils/sortedStationData'
import useTimestampInterval from '@/lib/utils/timestampInterval'
import { useParams, useRouter } from 'next/navigation'

type SidebarProps = {
    data: TimeTable[]
    destination: TrainDestination
}

function Sidebar({ data, destination }: SidebarProps) {
    const router = useRouter();
    const params = useParams();
    const city = params.city
    const locale = useLocale();
    const translation = useTranslations('TimeTable');
    const timeStampNow = useTimestampInterval();
    const nextStation = useSortedStationData(data, timeStampNow, router)
    const { stationNextName, stationNextTrainType, stationNextTrainNumber, stationNextTimestamp, stationNextTrainTrack } = nextStation;

    return (
        <div className='grid grid-rows-[min-content_1fr] px-4 max-w-lg'>
            <div className='flex flex-wrap justify-between py-8'>
                <div className='flex flex-col flex-grow'>
                    <span className='uppercase font-medium text-slate-500'>
                        {destination === 'ARRIVAL' ? translation('nextDeparture') : translation('nextDestination')}
                    </span>
                    <div className='flex flex-wrap'>
                        <span className='font-bold text-4xl text-blue-400'>
                            {stationNextName}
                        </span>
                        <div className='flex flex-grow items-center justify-center'>
                            <span className='font-medium text-xl text-slate-400'>
                                {stationNextTrainType} {stationNextTrainNumber}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <ArrivalTimestamp
                    city={city}
                    destination={destination}
                    locale={locale}
                    stationNextTimestamp={stationNextTimestamp}
                    stationNextTrainTrack={stationNextTrainTrack}
                    timeStampNow={timeStampNow}
                    data={data}></ArrivalTimestamp>
                <span className='text-slate-400 text-sm'>
                    {translation('disclaimer')}
                </span>
            </div>
        </div>
    )
}

export default Sidebar