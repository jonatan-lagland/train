'use client'
import React, { useContext } from 'react'
import HomeIcon from './homeIcon'
import SettingsDialog from './settingsDialog'
import CityComboBox from './cityComboBox'
import { StationMetadataContext } from '@/lib/context/StationMetadataContext'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'


function NavigationSheetContent() {

    const t = useTranslations('Navigation');
    const stationMetadata = useContext(StationMetadataContext)
    const params = useParams()
    const selectCity = t('selectCity');
    const defaultCity = params.city ? params.city as string : selectCity; // Localized label for "Select a city" used when on the home page

    return (
        <div className="flex flex-col sm:flex-row gap-12 py-0 items-center">
            <div className='flex-shrink'>
                <HomeIcon></HomeIcon>
            </div>
            <div className='sm:order-last flex-shrink'>
                <SettingsDialog></SettingsDialog>
            </div>
            <div className="flex items-center flex-grow justify-center">
                <CityComboBox stationMetadata={stationMetadata} defaultCity={defaultCity}></CityComboBox>
            </div>
        </div>
    )
}

export default NavigationSheetContent