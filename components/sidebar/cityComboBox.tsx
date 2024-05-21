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
import { useRouter } from "@/navigation"
import sanitizeStationName from "@/lib/utils/sanitizeStationName"

type CityComboBoxProps = {
    stationMetadata: StationMetaData[] | []
    defaultCity: string | ''
}

export default function CityComboBox({ stationMetadata, defaultCity }: CityComboBoxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const router = useRouter();
    const t = useTranslations('Navigation');

    // Function to URL-encode special characters into UTF-8 percent encoding
    const sanitizeForURL = (str: string) => {
        return encodeURIComponent(str.toLowerCase());
    };

    // Function to handle selection and navigation
    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
        // Use the sanitizeForURL function to encode special characters
        const sanitizedURL = sanitizeForURL(currentValue);
        const url = `/${sanitizedURL}`;
        router.push(url);
    };

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
                        {decodeURIComponent(defaultCity)}
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
                                const sanitizedStationName = sanitizeStationName(station.stationName)
                                return (
                                    <CommandItem
                                        key={station.stationShortCode}
                                        value={sanitizedStationName} // Pass the sanitized station name as the value
                                        onSelect={() => handleSelect(sanitizedStationName)}
                                    >
                                        <span className="capitalize">{sanitizedStationName}</span>

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
