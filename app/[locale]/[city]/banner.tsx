'use client'
import React from 'react'
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { BannerProps } from './page';
import { Train, ArrowOutward, ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/material';
import useStationDestination from '@/lib/utils/useStationDestination';
import { useContext } from 'react';
import { StationMetadataContext } from '@/lib/context/StationMetadataContext';

export default function Banner({ destinationLabel }: BannerProps) {
    const params = useParams()

    const city: string = params.city ? params.city as string : ""
    const stationMetadata = useContext(StationMetadataContext)
    const cityLabel = useStationDestination({ city, stationMetadata });

    const t = useTranslations('TimeTable')
    const iconColor: string = destinationLabel === 'arrivalTrains' ? '#1976d2' : '#b619d2'

    return (
        <div className='flex flex-row gap-8 items-center font-besley px-8 py-6 w-full shadow-md bg-white'>
            <span className='flex flex-col gap-1'>
                <h1 className="text-5xl flex-auto font-semibold capitalize">{cityLabel}</h1>
                <h2 className={`text-3xl flex-grow font-semibold text-blue-900`}>{t(`${destinationLabel}`)}</h2>
            </span>
            <div className='flex flex-row gap-2'>
                <Box
                    sx={{
                        backgroundColor: iconColor, // Your desired background color
                        padding: "10px", // Adjust padding as needed
                        borderRadius: "50%", // Optional, makes the icon container circular
                        display: "inline-flex",
                    }}
                >
                    {destinationLabel === 'arrivalTrains' ?
                        <ArrowBack
                            style={{
                                color: "#FFFFFF", // Set the icon color to white
                            }}
                        /> :
                        <ArrowOutward
                            style={{
                                color: "#FFFFFF", // Set the icon color to white
                            }}
                        />
                    }
                </Box>
            </div>
        </div>
    )
}
