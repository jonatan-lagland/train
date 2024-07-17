'use client'
import React, { useContext, useEffect, useState, useTransition } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { SpinnerSm } from '../ui/spinner';
import { Check, SwapVert } from '@mui/icons-material';

type DestinationType = "departure" | "arrival" | undefined;
type NavigationContainerProps = {
    isNotFoundPage?: boolean
}

function NavigationContainer({ isNotFoundPage }: NavigationContainerProps) {
    const stationMetadata = useContext(StationMetadataContext)
    const [isDisableRadioButtons, setIsDisableRadioButtons] = useState(false)
    const t = useTranslations()
    const params = useParams()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const locale = useLocale()
    const locationRequired = t('Navigation.errorSelectLocation');
    const placeholderLabel = t('TimeTable.placeholder');
    const defaultCity = isNotFoundPage ? undefined : params.city as string;
    const destinationParam = isNotFoundPage ? undefined : searchParams.get('destination') as string;

    const FormSchema = z.object({
        type: z.enum(["departure", "arrival"], {
            required_error: "Please select a destination type.",
        }),
        location: z.string({
            required_error: locationRequired,
        }),
        destination: z.string().optional(),
    })

    const initialDefaultValues = {
        type: "departure" as DestinationType,
        location: defaultCity ? decodeURIComponent(defaultCity) : undefined,
        destination: destinationParam ? decodeURIComponent(destinationParam) : undefined,
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            type: initialDefaultValues.type,
            location: undefined,
            destination: undefined
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { location, destination, type } = data;
        const sanitizedLocation = encodeURIComponent(location)
        const navigationPath = setNavigationPath(sanitizedLocation, type, destination)

        startTransition(() => {
            router.push(navigationPath);
        });
    }

    function setNavigationPath(sanitizedLocation: string, type: "departure" | "arrival", destination?: string) {
        let navigationPath = '';
        if (destination) {
            navigationPath = `/${locale}/${sanitizedLocation}?type=departure&destination=${destination}`;
        } else {
            navigationPath = `/${locale}/${sanitizedLocation}?type=${type}`;
        }
        return navigationPath;
    }


    // Watch changes in value for destination
    const destinationValue = form.watch("destination");
    const locationValue = form.watch('location');

    // If destination has been selected OR form is being submitted, disable radio buttons
    useEffect(() => {
        if (!!destinationValue || isPending) {
            setIsDisableRadioButtons(true)
        } else {
            setIsDisableRadioButtons(false)
        }
    }, [destinationValue, isPending])

    useEffect(() => {
        if (defaultCity) {
            form.setValue('location', decodeURIComponent(defaultCity));
        }
        if (destinationParam) {
            form.setValue('destination', decodeURIComponent(destinationParam));
        }
    }, []);



    return (
        <div className='flex flex-row items-center justify-center h-96'>
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
                                                    disabled={isPending}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <span className='truncate'>
                                                        {field.value ? capitalizeTitle(field.value) : placeholderLabel}
                                                    </span>
                                                    <div className='flex flex-row justify-end'>
                                                        {field.value && (
                                                            <Cross2Icon
                                                                className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    form.resetField("location")
                                                                }}
                                                            />
                                                        )}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </div>
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
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            station.stationShortCode === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <span className="capitalize">{sanitizedStationName}</span>


                                                                </CommandItem>
                                                            );
                                                        })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-1'>
                                    <div className='flex flex-row items-center justify-between gap-1'>
                                        <FormLabel className='pointer-events-none'>{t('TimeTable.destination')}</FormLabel>
                                        <Button
                                            disabled={!locationValue || !destinationValue}
                                            variant="ghost"
                                            role="swap"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                const currentLocation = form.getValues("location");
                                                const currentDestination = field.value as string;
                                                form.setValue("location", currentDestination);
                                                form.setValue("destination", currentLocation);
                                            }}
                                        >
                                            <SwapVert color="action" />
                                        </Button>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={isPending}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <span className='truncate'>
                                                        {field.value ? capitalizeTitle(field.value) : placeholderLabel}
                                                    </span>
                                                    <div className='flex flex-row justify-end'>
                                                        {field.value && (
                                                            <Cross2Icon
                                                                className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    form.resetField("destination")
                                                                }}
                                                            />
                                                        )}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </div>
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
                                            disabled={isDisableRadioButtons}
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
                        <Button disabled={isPending} type="submit">{isPending ? <SpinnerSm></SpinnerSm> : t("Navigation.search")}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NavigationContainer