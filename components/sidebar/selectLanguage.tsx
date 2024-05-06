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
}

const SelectItemLanguage = ({ lang, size }: SelectItemLanguageProps) => {
    return (
        <div className="flex flex-row items-center gap-4">
            <Image
                src={lang.src}
                width={size}
                height={size}
                alt={lang.alt}
            />
            <span>{lang.name}</span>
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

    const useChangeLocale = (selectedLanguage: string) => {
        router.replace(pathname, { locale: `${selectedLanguage}` });
    }

    return (
        <Select onValueChange={useChangeLocale}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={
                    currentLanguage ?
                        <SelectItemLanguage lang={currentLanguage} size={size} /> :
                        "Select a language" // Fallback placeholder text
                } />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {languages.map(lang => (
                        <SelectItem key={lang.id} value={lang.id}>
                            <SelectItemLanguage lang={lang} size={size}></SelectItemLanguage>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}