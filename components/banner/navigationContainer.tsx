'use client'
import React, { useContext } from 'react'
import CityComboBox from '../sidebar/cityComboBox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import sanitizeStationName from '@/lib/utils/sanitizeStationName';
import { StationMetadataContext } from '@/lib/context/StationMetadataContext';

function NavigationContainer() {
    const stationMetaData = useContext(StationMetadataContext)
    const t = useTranslations();
    const params = useParams()
    const selectCity = t('Navigation.selectCity');
    const defaultCity = params.city ? params.city as string : selectCity;

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
    }

    return (
        <div className='flex flex-col p-4 shadow-md rounded-lg px-6'>
            <div className="flex flex-wrap gap-2">
                <CityComboBox stationMetadata={stationMetaData} defaultCity={defaultCity}></CityComboBox>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            <span className="capitalize">
                                Minne
                            </span>
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder={t("Navigation.searchCity")} className="h-9" />
                            <CommandEmpty>{t("Navigation.searchnotfound")}</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {stationMetaData.map((station) => {
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
            </div>
        </div>
    )
}

export default NavigationContainer