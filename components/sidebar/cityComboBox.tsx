"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { StationMetaData } from "@/lib/types"

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

type CityComboBoxProps = {
    stationMetadata: StationMetaData[] | []
    defaultCity: string | ''
}

export default function CityComboBox({ stationMetadata, defaultCity }: CityComboBoxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const t = useTranslations('Navigation');

    console.log(stationMetadata)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <span className="capitalize">
                        {value
                            ? stationMetadata.find((station) => station.stationName === value)?.stationName
                            : defaultCity}
                    </span>
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={t("searchCity")} className="h-9" />
                    <CommandEmpty>{t("searchnotfound")}</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {stationMetadata.map((station) => {
                                // Remove "asema" from labels when preceded by a space or start of the string
                                const sanitizedStationName = station.stationName.replace(/(^|\s)asema\b/gi, '').trim();
                                return (
                                    <CommandItem
                                        key={station.stationShortCode}
                                        value={sanitizedStationName} // Pass the sanitized station name as the value
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {sanitizedStationName} {/* Display the sanitized station name */}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === station.stationShortCode ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
