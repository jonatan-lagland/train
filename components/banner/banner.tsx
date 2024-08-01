import React from 'react'
import { getTranslations } from 'next-intl/server';
import { BannerLabel } from '../../app/[locale]/[city]/page';

type BannerProps = {
    destinationLabel: BannerLabel
    city: string
    cityDestination?: string
    isCommuter?: string
}

export default async function Banner({ destinationLabel, city, cityDestination, isCommuter }: BannerProps) {
    const cityLabel = decodeURIComponent(city)
    const cityDestinationLabel = cityDestination ? decodeURIComponent(cityDestination) : undefined;
    const t = await getTranslations('TimeTable')

    const labelFontSize = cityDestinationLabel
        ? 'text-3xl md:text-5xl'
        : 'text-5xl md:text-7xl';

    const headerText = cityDestinationLabel ? `${cityLabel} — ${cityDestinationLabel}` : cityLabel
    const subheaderText = isCommuter === 'true' ? t('commuterTrains') : t(destinationLabel);

    return (
        <div className='flex flex-row gap-8 items-center font-inter px-1 py-6'>
            <div className='flex flex-col gap-1'>
                <h1 className={`flex-auto font-semibold font-robotoslab text-white capitalize break-words ${labelFontSize}`}>
                    {headerText}
                </h1>
                <h2 className={`text-2xl md:text-4xl font-robotoslab flex-grow font-semibold text-white`}>
                    {subheaderText}
                </h2>
            </div>
        </div>
    );
}