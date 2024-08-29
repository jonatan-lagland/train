'use client'
import React, { useContext, useEffect, useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { StationMetadataContext } from '@/lib/context/StationMetadataContext';
import NavigationComponent from './navigationComponent';
import { TrainDestinationParams } from '@/lib/types';



type NavigationContainerProps = {
    isNotFoundPage?: boolean
    title?: string
}

function NavigationContainer({ isNotFoundPage, title }: NavigationContainerProps) {
    const stationMetadata = useContext(StationMetadataContext)
    const t = useTranslations()
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const locale = useLocale()
    const locationRequired = t('Navigation.errorSelectLocation');
    const defaultCity = isNotFoundPage ? undefined : params.city as string;
    const destinationParam = isNotFoundPage ? undefined : searchParams.get('destination') as string;
    const typeParam = searchParams.get('type') as TrainDestinationParams;
    const commuterParam = searchParams.get('commuter');
    const isCommuter = commuterParam?.toLowerCase() === 'true' ? true : false; // search params are treated as a string

    const componentProps = {
        title,
        stationMetadata,
        t,
        router,
        locale,
        locationRequired,
        defaultCity,
        destinationParam,
        typeParam,
        isCommuter
    };

    return <NavigationComponent {...componentProps} />;
}

export default NavigationContainer