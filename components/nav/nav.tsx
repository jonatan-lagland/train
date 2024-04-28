import React from 'react'
import { SelectLanguage } from './selectLanguage'
import { languages } from '@/lib/languages'
import { useLocale } from 'next-intl';

function Nav() {

    const locale = useLocale();

    return (
        <>
            <span>Logo</span>
            <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
        </>
    )
}

export default Nav