'use client'
import React from 'react'
import { TimeTable, TrainDestination } from '../table/timetable'
import { useLocale, useTranslations } from 'next-intl'
import ArrivalTimestamp from './arrivalTimestamp'
import useSortedStationData from '@/lib/utils/sortedStationData'
import useTimestampInterval from '@/lib/utils/timestampInterval'
import { useParams, useRouter } from 'next/navigation'
import { SiteLocale } from '@/lib/types'
import LiveTrainGPS from './liveTrainGPS'


type SidebarProps = {
    data: TimeTable[]
    destinationType: TrainDestination
}

function Sidebar({ data, destinationType }: SidebarProps) {
    const router = useRouter();
    const params = useParams();
    const city = params.city
    const locale = useLocale() as SiteLocale;
    const translation = useTranslations('TimeTable');
    const timeStampNow = useTimestampInterval();
    const nextStation = useSortedStationData(data, timeStampNow, router)
    const { stationNextName, stationNextTrainType, stationNextTrainNumber, stationNextTimestamp, stationNextTrainTrack } = nextStation;

    return (
        <div className='flex flex-col gap-5 px-4 max-w-lg'>
            <div className='grid grid-rows-[min-content_1fr]'>
                <div className='flex flex-wrap justify-between py-8'>
                    <div className='flex flex-col flex-grow'>
                        <span className='uppercase font-medium text-slate-600'>
                            {destinationType === 'ARRIVAL' ? translation('nextDeparture') : translation('nextDestination')}
                        </span>
                        <div className='flex flex-wrap'>
                            <span className='font-bold text-4xl text-blue-400'>
                                {stationNextName}
                            </span>
                            <div className='flex flex-grow items-center justify-center'>
                                <span className='font-medium text-xl text-slate-700'>
                                    {stationNextTrainType} {stationNextTrainNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <ArrivalTimestamp
                    city={city}
                    destinationType={destinationType}
                    locale={locale}
                    stationNextTimestamp={stationNextTimestamp}
                    stationNextTrainTrack={stationNextTrainTrack}
                    timeStampNow={timeStampNow}
                    data={data}>
                </ArrivalTimestamp>

            </div>
            <div className='flex flex-col gap-2'>
                <LiveTrainGPS stationNextTrainNumber={stationNextTrainNumber}></LiveTrainGPS>
                <div className='text-sm text-slate-600'>
                    <span className='font-medium'>{translation('disclaimerTitle')}: </span><span>{translation('disclaimer')}</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar