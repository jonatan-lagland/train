import React from 'react'
import HomeIcon from './homeIcon'
import SettingsDialog from './settingsDialog'
import CityComboBox from './cityComboBox'


function NavigationSheetContent() {
    //flex flex-col sm:flex-row gap-12 py-8 sm:py-0
    return (
        <div className="flex flex-col sm:flex-row gap-12 py-0 items-center">
            <div className='flex-shrink'>
                <HomeIcon></HomeIcon>
            </div>
            <div className='sm:order-last flex-shrink'>
                <SettingsDialog></SettingsDialog>
            </div>
            <div className="flex items-center flex-grow justify-center">
                <CityComboBox></CityComboBox>
            </div>
        </div>
    )
}

export default NavigationSheetContent