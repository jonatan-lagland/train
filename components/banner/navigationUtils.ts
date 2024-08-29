import { TrainDestinationParams } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export type NavigationUtilsProps = {
    typeParam: TrainDestinationParams;
    defaultCity: string | undefined;
    destinationParam: string | undefined;
    isCommuter: boolean;
    locationRequired: string;
    router: AppRouterInstance;
    locale: string;
}

export default function NavigationUtils({ typeParam, defaultCity, destinationParam, isCommuter, locationRequired, router, locale }: NavigationUtilsProps) {
    const [isDisableRadioButtons, setIsDisableRadioButtons] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [destinationOpen, setDestinationOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const FormSchema = z.object({
        type: z.enum(["departure", "arrival"], {
            required_error: "Please select a destination type.",
        }),
        location: z.string({
            required_error: locationRequired,
        }),
        destination: z.string().optional(),
        commuter: z.boolean()
    })

    const initialDefaultValues = {
        type: typeParam ? typeParam : "departure" as TrainDestinationParams,
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

    function setNavigationPath(sanitizedLocation: string, type: TrainDestinationParams, commuter: boolean, destination?: string) {
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
        {
            form,
            onSubmit,
            locationValue,
            destinationValue,
            locationOpen,
            setLocationOpen,
            isPending,
            destinationOpen,
            setDestinationOpen,
            isDisableRadioButtons
        }
    )
}