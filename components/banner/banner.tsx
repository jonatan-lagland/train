import React from 'react'
import { getTranslations } from 'next-intl/server';
import { BannerLabel } from '../../app/[locale]/[city]/page';

type BannerProps = {
    destinationLabel: BannerLabel
    city: string
    cityDestination?: string
}

export default async function Banner({ destinationLabel, city, cityDestination }: BannerProps) {
    const cityLabel = decodeURIComponent(city)
    const cityDestinationLabel = cityDestination ? decodeURIComponent(cityDestination) : undefined;
    const t = await getTranslations('TimeTable')

    const labelFontSize = cityDestinationLabel
        ? 'text-3xl md:text-5xl'
        : 'text-5xl md:text-7xl';

    return (
        <div className='flex flex-row gap-8 items-center font-inter px-1 py-6'>
            <div className='flex flex-col gap-1'>
                <h1 className={`flex-auto font-semibold text-white capitalize break-words ${labelFontSize}`}>
                    {cityDestinationLabel ? `${cityLabel} — ${cityDestinationLabel}` : cityLabel}
                </h1>
                <h2 className={`text-2xl md:text-4xl flex-grow font-semibold text-white`}>
                    {t(`${destinationLabel}`)}
                </h2>
            </div>
        </div>
    );
}