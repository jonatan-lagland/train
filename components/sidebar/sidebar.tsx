'use client'
import React, { useContext } from 'react'

import { useLocale, useTranslations } from 'next-intl'
import ArrivalTimestamp from './arrivalTimestamp'
import useSortedStationData from '@/lib/utils/sortedStationData'
import useTimestampInterval from '@/lib/utils/timestampInterval'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SiteLocale, TimeTable, TrainDestination } from '@/lib/types'
import LiveTrainGPS from './liveTrainGPS'
import { SelectedTrainContext } from '@/lib/context/SelectedTrainContext'
import useCommuterLink from '@/lib/utils/commuterLink'


type SidebarProps = {
    data: TimeTable[]
    destinationType: TrainDestination
}

function Sidebar({ data, destinationType }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname()
    const params = useParams();
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const destination = searchParams.get('destination')
    const commuter = searchParams.get('commuter')
    const commuterLink = useCommuterLink(pathname, type, destination, commuter)
    const { selectedTrainNumber, setTrainNumber, sidebarRef } = useContext(SelectedTrainContext);
    const city = params.city as string
    const locale = useLocale() as SiteLocale;
    const translation = useTranslations('TimeTable');
    const destinationText = destinationType === 'ARRIVAL' ? translation('nextDeparture') : translation('nextDestination');
    const timeStampNow = useTimestampInterval();
    const nextStation = useSortedStationData(data, selectedTrainNumber, setTrainNumber, timeStampNow, router)
    const { stationNextName, stationNextTrainType, stationNextTrainNumber, stationNextTimestamp, stationNextTrainTrack } = nextStation;

    return (
        <div className='flex flex-col gap-5 px-4 max-w-lg'>
            <div className='grid grid-rows-[min-content_min_content]'>
                {data.length === 0 ? null :
                    <>
                        <div className='flex flex-wrap justify-between py-8'>
                            <div className='flex flex-col flex-grow'>

                                <span className='uppercase font-medium text-slate-600'>
                                    {destinationText}
                                </span>

                                <div className='flex flex-wrap'>
                                    <span className='font-bold text-4xl text-blue-500'>
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
                    </>
                }
                <div className='flex items-center justify-center h-16'>
                    <ArrivalTimestamp
                        city={city}
                        destinationType={destinationType}
                        locale={locale}
                        stationNextTimestamp={stationNextTimestamp}
                        stationNextTrainTrack={stationNextTrainTrack}
                        timeStampNow={timeStampNow}
                        data={data}
                        commuterLink={commuterLink}
                    >
                    </ArrivalTimestamp>
                </div>
            </div>
            <div ref={sidebarRef} className='flex flex-col gap-2'>
                <LiveTrainGPS nextStation={nextStation}></LiveTrainGPS>
                <div className='text-sm text-slate-600'>
                    <span className='font-medium'>{translation('disclaimerTitle')}: </span><span>{translation('disclaimer')}</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar