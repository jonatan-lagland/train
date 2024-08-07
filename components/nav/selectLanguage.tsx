'use client'
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { useRouter, usePathname } from "@/navigation"
import { useTranslations } from "next-intl"

export type Languages = {
    id: string
    src: string
    alt: string
    name: string
    label: string
}

export type LanguagesProps = {
    languages: Languages[]
    currentLanguageId: string
    size?: number
}

type SelectItemLanguageProps = {
    lang: Languages
    size: number
    displayLabel?: boolean
}

const SelectItemLanguage = ({ lang, size, displayLabel = false }: SelectItemLanguageProps) => {
    return (
        <div className="flex flex-row items-center gap-4">
            <Image
                src={lang.src}
                width={size}
                height={size}
                alt={lang.alt}
            />
            {displayLabel ? <span>{lang.name}</span> : null}
        </div>
    )
}

/* 
    NOTE: usePathname and useRouter use the next-intl wrapper
    * languages:                An array of all available languages
    * currentLanguageId:        Id of the default or currently selected language
    * size                      Size of the country flag image
*/


export function SelectLanguage({ languages, currentLanguageId, size = 24 }: LanguagesProps) {
    const currentLanguage = languages.find(lang => lang.id === currentLanguageId);
    const label = currentLanguage?.label || 'Select a language';
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Navigation")

    const useChangeLocale = (selectedLanguage: string) => {
        router.replace(pathname, { locale: `${selectedLanguage}` });
        router.refresh()
    }

    return (
        <Select onValueChange={useChangeLocale}>
            <SelectTrigger className="w-max" aria-label={t("selectLanguage")}>
                <SelectValue placeholder={
                    currentLanguage ?
                        <SelectItemLanguage lang={currentLanguage} size={size} displayLabel={true} /> :
                        t("selectLanguage") // Fallback placeholder text
                } />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {languages.map(lang => (
                        <SelectItem key={lang.id} value={lang.id}>
                            <SelectItemLanguage lang={lang} size={size} displayLabel={true}></SelectItemLanguage>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}