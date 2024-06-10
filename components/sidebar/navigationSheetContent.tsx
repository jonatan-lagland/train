import React from 'react'
import HomeIcon from './homeIcon'
import SettingsDialog from './settingsDialog'

function NavigationSheetContent() {
    return (
        <div className="flex flex-row items-center justify-center">
            <HomeIcon></HomeIcon>
            <SettingsDialog></SettingsDialog>
        </div>
    )
}

export default NavigationSheetContent