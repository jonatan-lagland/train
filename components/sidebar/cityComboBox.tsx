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

type CityComboBoxProps = {
    stationMetadata: StationMetaData[] | []
    defaultCity: string | ''
}

export default function CityComboBox({ stationMetadata, defaultCity }: CityComboBoxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const router = useRouter();
    const t = useTranslations('Navigation');

    // Function to remove diacritical marks and convert to standard ASCII characters
    const normalizeString = (str: string) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-zA-Z0-9]/g, "") // Remove other special characters
            .toLowerCase(); // Convert to lowercase

    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);

        // Use the normalizeString function to clean up the station name
        const sanitizedURL = normalizeString(currentValue);
        const url = `/${encodeURIComponent(sanitizedURL)}`;
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
                                const sanitizedStationName = station.stationName
                                    // Remove "asema" when preceded by a space or at the start
                                    .replace(/(^|\s)asema\b/gi, "")
                                    // Replace underscores with spaces
                                    .replace(/_/g, " ")
                                    .trim(); // Remove leading/trailing spaces

                                return (
                                    <CommandItem
                                        key={station.stationShortCode}
                                        value={sanitizedStationName} // Pass the sanitized station name as the value
                                        onSelect={() => handleSelect(sanitizedStationName)}
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
