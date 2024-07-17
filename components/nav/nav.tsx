import React from 'react'
import HomeIcon from './homeIcon'
import LanguageContainer from './languageContainer'


function Nav() {
    return (
        <div className="grid grid-rows-1 grid-cols-2 w-full h-full items-center justify-end">
            <div className='flex flex-row items-center justify-center'>
                <HomeIcon></HomeIcon>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <LanguageContainer></LanguageContainer>
            </div>
        </div>
    )
}

export default Nav