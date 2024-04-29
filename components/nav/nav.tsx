import React from 'react'
import { NavigationSheet } from '../sidebar/navigationSheet';
import { HomeSharp } from '@mui/icons-material';
import Link from 'next/link';

function Nav() {
    return (
        <>
            <div className='flex items-center'>
                <Link href="/">
                    <HomeSharp sx={{ fontSize: 32 }}></HomeSharp>
                </Link>
            </div>
            <div>
                <NavigationSheet></NavigationSheet>
            </div>
        </>
    )
}

export default Nav