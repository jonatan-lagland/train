'use client'
import React from 'react'
import Link from 'next/link'
import { HomeSharp } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

function HomeIcon() {
    const t = useTranslations('Navigation');
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Link href="/">
                <div className='sidebar-item'>
                    <HomeSharp className={isHovered ? 'wiggle-icon' : ''}></HomeSharp>
                    <span>{t('home')}</span>
                </div>
            </Link>
        </div>
    )
}

export default HomeIcon