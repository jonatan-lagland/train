import React from 'react'
import { getTranslations } from 'next-intl/server';
import { BannerLabel } from '../../app/[locale]/[city]/page';

type BannerProps = {
    destinationLabel: BannerLabel
    city: string
}

export default async function Banner({ destinationLabel, city }: BannerProps) {
    const cityLabel = decodeURIComponent(city)
    const t = await getTranslations('TimeTable')

    return (
        <div className='flex flex-row gap-8 items-center font-besley px-1 py-6 drop-shadow-lg'>
            <span className='flex flex-col gap-1'>
                <h1 className="text-5xl md:text-7xl flex-auto font-semibold text-white capitalize">{cityLabel}</h1>
                <h2 className={`text-2xl md:text-4xl flex-grow font-semibold text-white`}>{t(`${destinationLabel}`)}</h2>
            </span>
        </div>
    )
}
