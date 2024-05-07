'use client'
import React from 'react'
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { BannerProps } from './page';

export default function Banner({ destinationLabel }: BannerProps) {

    const t = useTranslations('TimeTable')
    const params = useParams()

    return (
        <div>
            <h1 className="text-3xl font-semibold capitalize">{params.city}</h1>
            <h2 className="text-xl font-semibold">{t(`${destinationLabel}`)}</h2>
        </div>
    )
}
