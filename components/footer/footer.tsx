import { getTranslations } from 'next-intl/server'
import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch';

async function Footer() {
    const t = await getTranslations('TermsOfService')
    return (
        <a href="https://www.digitraffic.fi/kayttoehdot/" target="_blank" rel="noopener noreferrer" className="text-blue-500">
            <div className='flex flex-row items-center gap-1 text-sm hover:underline'>
                <LaunchIcon fontSize='small'></LaunchIcon>
                {t("title")}
            </div>
        </a>
    )
}

export default Footer