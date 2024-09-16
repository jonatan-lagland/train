'use client'
import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslations } from 'next-intl';

function Footer() {
    const t = useTranslations('TermsOfService')
    return (
        <div className='flex flex-wrap justify-start items-center'>
            <a href="https://www.digitraffic.fi/kayttoehdot/" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                <div className='flex flex-row items-center gap-1 text-sm hover:underline'>
                    <LaunchIcon fontSize='small'></LaunchIcon>
                    <span>{t("title")}</span>
                </div>
            </a>
        </div>
    )
}

export default Footer