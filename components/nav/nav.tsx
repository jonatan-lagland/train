import React from 'react'
import { NavigationSheet } from '../sidebar/navigationSheet';
import NavigationSheetContent from '../sidebar/navigationSheetContent';

function Nav() {
    return (
        <>
            <div className='w-full drop-shadow-md	'>
                <NavigationSheetContent></NavigationSheetContent>
            </div>
        </>
    )
}

export default Nav