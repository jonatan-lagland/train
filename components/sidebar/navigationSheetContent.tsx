import React from 'react'
import { HomeSharp, Settings } from '@mui/icons-material';
import Link from 'next/link';
import SettingsDialog from '../nav/settingsDialog';
import { useTranslations } from 'next-intl';

function NavigationSheetContent() {

    const t = useTranslations('Navigation');

    return (
        <div className="flex flex-col justify-between gap-3 py-4">
            <div className='flex flex-col gap-1'>
                <Link href="/">
                    <div className='sidebar-item'>
                        <HomeSharp></HomeSharp>
                        <span>{t('home')}</span>
                    </div>
                </Link>

            </div>
            <SettingsDialog></SettingsDialog>
        </div>
    )
}

export default NavigationSheetContent