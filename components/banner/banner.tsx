import React from 'react'
import { getTranslations } from 'next-intl/server';
import { BannerLabel } from '../../app/[locale]/[city]/page';
import { ArrowOutward, ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/material';

type BannerProps = {
    destinationLabel: BannerLabel
    city: string
}

export default async function Banner({ destinationLabel, city }: BannerProps) {
    const cityLabel = decodeURIComponent(city)
    const t = await getTranslations('TimeTable')
    const iconColor: string = destinationLabel === 'arrivalTrains' ? '#1976d2' : '#b619d2'

    return (
        <div className='flex flex-row gap-8 items-center font-besley px-1 py-6'>
            <span className='flex flex-col gap-1'>
                <h1 className="text-6xl flex-auto font-semibold text-white capitalize">{cityLabel}</h1>
                <h2 className={`text-3xl flex-grow font-semibold text-blue-900`}>{t(`${destinationLabel}`)}</h2>
            </span>
        </div>
    )
}
