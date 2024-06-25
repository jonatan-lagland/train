import React from 'react'
import { TimeTable, TrainDestination } from './timetable'
import { useTranslations } from 'next-intl'

type SidebarProps = {
    data: TimeTable[]
    destination: TrainDestination
}

function Sidebar({ data, destination }: SidebarProps) {
    const translation = useTranslations('TimeTable');
    const sortedData = [...data].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    const stationNextName = sortedData[0]?.stationName;
    const stationNextTimestamp = sortedData[0]?.scheduledTime;
    const stationNextTrainType = sortedData[0]?.trainType;
    const stationNextTrainNumber = sortedData[0]?.trainNumber;
    const stationNextTrainTrack = sortedData[0]?.commercialTrack;
    const timeStampNow = Date.now();

    const timeDifference = new Date(stationNextTimestamp).getTime() - new Date(timeStampNow).getTime();
    const totalMinutes = Math.max(Math.floor(timeDifference / 60000), 0); // Ensure the value is not negative with Math.max
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const travelTime = hours > 0
        ? `${hours} ${translation('longHour')} ${minutes} ${translation('longMin')}`
        : `${minutes} ${translation('longMin')}`;

    return (
        <div className='grid grid-rows-[min-content_1fr] px-4 max-w-lg'>
            <div className='flex flex-wrap justify-between py-8'>
                <div className='flex flex-col flex-grow'>
                    <span className='uppercase font-medium text-slate-500'>
                        {destination === 'ARRIVAL' ? 'Seuraavan junan lähtöasema' : 'Seuraavan junan määränpää'}
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
                <span className='font-medium text-xl text-slate-400'>
                    {data.length === 0 ? <span>{translation('noJourneyFound')}</span> : (
                        <>Saapuu Tampere asemalle <span className='font-bold'>{travelTime}</span> kuluttua raiteelle <span>{stationNextTrainTrack}</span>.</>
                    )}
                </span>
                <span className='text-slate-400 text-sm'>
                    {translation('disclaimer')}
                </span>
            </div>
        </div>
    )
}

export default Sidebar