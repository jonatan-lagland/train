'use client'
import React, { useContext, useEffect, useState, useTransition } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
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
    FormMessage
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { SpinnerSm } from '../ui/spinner';
import { Check, SwapVert } from '@mui/icons-material';
import { Checkbox } from '../ui/checkbox';

type DestinationType = "departure" | "arrival" | undefined;
type NavigationContainerProps = {
    isNotFoundPage?: boolean
    title?: string
}

function NavigationContainer({ isNotFoundPage, title }: NavigationContainerProps) {
    const stationMetadata = useContext(StationMetadataContext)
    const [isDisableRadioButtons, setIsDisableRadioButtons] = useState(false)
    const t = useTranslations()
    const params = useParams()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const locale = useLocale()
    const locationRequired = t('Navigation.errorSelectLocation');
    const defaultCity = isNotFoundPage ? undefined : params.city as string;
    const destinationParam = isNotFoundPage ? undefined : searchParams.get('destination') as string;
    const typeParam = searchParams.get('type') as DestinationType;
    const commuterParam = searchParams.get('commuter') as string;
    const isCommuter = commuterParam === 'true' ? true : false; // search params are treated as a string

    const FormSchema = z.object({
        type: z.enum(["departure", "arrival"], {
            required_error: "Please select a destination type.",
        }),
        location: z.string({
            required_error: locationRequired,
        }),
        destination: z.string().optional(),
        commuter: z.boolean(),
    })

    const initialDefaultValues = {
        type: typeParam ? typeParam : "departure" as DestinationType,
        location: defaultCity ? decodeURIComponent(defaultCity) : undefined,
        destination: destinationParam ? decodeURIComponent(destinationParam) : undefined,
        commuter: isCommuter
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            type: initialDefaultValues.type,
            location: undefined,
            destination: undefined,
            commuter: initialDefaultValues.commuter,
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { location, destination, commuter, type } = data;
        const sanitizedLocation = encodeURIComponent(location)
        const navigationPath = setNavigationPath(sanitizedLocation, type, commuter, destination)

        startTransition(() => {
            router.push(navigationPath);
        });
    }

    function setNavigationPath(sanitizedLocation: string, type: "departure" | "arrival", commuter: boolean, destination?: string) {
        let navigationPath = '';
        if (destination) {
            navigationPath = `/${locale}/${sanitizedLocation}?type=departure&destination=${destination}&commuter=${commuter}`;
        } else {
            navigationPath = `/${locale}/${sanitizedLocation}?type=${type}&commuter=${commuter}`;
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
    }, [defaultCity, destinationParam, form]);

    return (
        <div className='flex flex-col items-center justify-center'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 shadow-md px-6 py-6 bg-white rounded-lg justify-between">
                    {title ? <span className='text-4xl font-robotoslab text-start font-semibold w-48'>{title}</span> : null}
                    <div className='flex flex-row'>
                        <div className='flex flex-row items-center justify-between gap-1 order-last'>
                            <Button
                                disabled={!locationValue || !destinationValue}
                                variant="ghost"
                                role="swap"
                                onClick={(e) => {
                                    e.preventDefault()
                                    const currentLocation = form.getValues("location");
                                    const currentDestination = form.getValues("destination") as string;
                                    form.setValue("location", currentDestination);
                                    form.setValue("destination", currentLocation);
                                }}
                            >
                                <SwapVert color="action" />
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1 items-start'>
                                        <div className=' h-4'>
                                            <FormMessage></FormMessage>
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
                                                            {field.value ? capitalizeTitle(field.value) : t('TimeTable.origin')}
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
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-1'>
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
                                                            {field.value ? capitalizeTitle(field.value) : t('TimeTable.destination')}
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
                    </div>

                    <FormField
                        control={form.control}
                        name="commuter"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-start items-center space-y-0 gap-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="leading-none">
                                    <FormLabel className='font-normal'>
                                        {t("Navigation.commuterRail")}
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

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
                    </div>
                    <Button disabled={isPending} type="submit">{isPending ? <SpinnerSm></SpinnerSm> : t("Navigation.search")}</Button>

                </form>
            </Form>
        </div>
    )
}

export default NavigationContainer