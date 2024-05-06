import React from 'react'
import { NavigationSheet } from '../sidebar/navigationSheet';
import NavigationSheetContent from '../sidebar/navigationSheetContent';

function Nav() {
    return (
        <>
            <div className='block sm:hidden h-full'>
                <NavigationSheet></NavigationSheet>
            </div>
            <div className='sm:block hidden w-full'>
                <NavigationSheetContent></NavigationSheetContent>
            </div>
        </>
    )
}

export default Nav