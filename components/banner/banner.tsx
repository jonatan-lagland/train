import fetchImages from '@/app/api/fetchBannerImages'
import Image from 'next/image'
import React from 'react'

async function Banner({ location }: { location: string }) {

    const bannerURL = await fetchImages(location)

    return (
        <Image
            src={bannerURL}
            width={200}
            height={200}
            alt="Picture of the author"
        />
    )
}

export default Banner