'use client'
import React, { useContext } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import sanitizeStationName from '@/lib/utils/sanitizeStationName';
import { StationMetadataContext } from '@/lib/context/StationMetadataContext';
import capitalizeTitle from '@/lib/utils/capitalizeTitle';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';

function NavigationContainer() {
    const stationMetadata = useContext(StationMetadataContext)
    const t = useTranslations()
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const locale = useLocale()
    const locationRequired = t('Navigation.errorSelectLocation');
    const placeholderLabel = t('TimeTable.placeholder');
    const defaultCity = params.city as string;
    const destinationParam = searchParams.get('destination') as string;

    const FormSchema = z.object({
        type: z.enum(["departure", "arrival"], {
            required_error: "Please select a destination type.",
        }),
        location: z.string({
            required_error: locationRequired
        }),
        destination: z.string().optional(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            type: "departure",
            location: defaultCity ? decodeURIComponent(defaultCity) : undefined,
            destination: destinationParam ? decodeURIComponent(destinationParam) : undefined
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { location, destination, type } = data;
        const sanitizedLocation = encodeURIComponent(location)

        if (destination) {
            const url = `/${locale}/${sanitizedLocation}?type=${type}&destination=${destination}`;
            router.push(url);
            return;
        }
        const url = `/${locale}/${sanitizedLocation}?type=${type}`;
        router.push(url);
    }

    return (
        <div className=''>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-4 gap-6 shadow-md bg-white rounded-lg px-6 justify-between">
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-1'>
                                    <FormLabel className='pointer-events-none'>{t('TimeTable.origin')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <span>
                                                        {field.value ? capitalizeTitle(field.value) : placeholderLabel}
                                                    </span>
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder={t("Navigation.searchCity")} className="h-9" />
                                                <CommandEmpty>{t("Navigation.searchnotfound")}</CommandEmpty>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {stationMetadata.map((station) => {
                                                            const sanitizedStationName = sanitizeStationName(station.stationName)
                                                            return (
                                                                <CommandItem
                                                                    key={station.stationShortCode}
                                                                    value={sanitizedStationName}
                                                                    onSelect={() => {
                                                                        form.setValue("location", sanitizedStationName)
                                                                    }}
                                                                >
                                                                    <span className="capitalize">{sanitizedStationName}</span>

                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            station.stationShortCode === field.value ? "opacity-100" : "opacity-0"
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-1'>
                                    <FormLabel className='pointer-events-none'>{t('TimeTable.destination')}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <span>
                                                        {field.value ? capitalizeTitle(field.value) : placeholderLabel}
                                                    </span>
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder={t("Navigation.searchCity")} className="h-9" />
                                                <CommandEmpty>{t("Navigation.searchnotfound")}</CommandEmpty>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {stationMetadata.map((station) => {
                                                            const sanitizedStationName = sanitizeStationName(station.stationName)
                                                            return (
                                                                <CommandItem
                                                                    key={station.stationShortCode}
                                                                    value={sanitizedStationName}
                                                                    onSelect={() => {
                                                                        form.setValue("destination", sanitizedStationName)
                                                                    }}
                                                                >
                                                                    <span className="capitalize">{sanitizedStationName}</span>

                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            station.stationShortCode === field.value ? "opacity-100" : "opacity-0"
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
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-grow flex-col gap-3 justify-between'>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="departure" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t("TimeTable.outgoing")}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="arrival" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t("TimeTable.incoming")}
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">{t("Navigation.search")}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NavigationContainer