import React from 'react'
import Link from 'next/link'

function HomeIcon() {
    return (
        <Link href="/">
            <div className='flex flex-row items-center px-7 py-5 bg-orange-700 h-full'>
                <span className='text-white font-bold'>Junataulut</span>
            </div>
        </Link>
    )
}

export default HomeIcon