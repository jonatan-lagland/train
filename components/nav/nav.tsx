import React from 'react'
import HomeIcon from './homeIcon'
import LanguageContainer from './languageContainer'


function Nav() {
    return (
        <div className="flex flex-row w-full h-full items-center justify-evenly shadow-md">
            <HomeIcon></HomeIcon>
            <LanguageContainer></LanguageContainer>
        </div>
    )
}

export default Nav