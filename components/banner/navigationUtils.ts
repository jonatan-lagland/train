import { TrainDestinationParams } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export type NavigationUtilsProps = {
    typeParam: TrainDestinationParams;
    defaultCity: string | undefined;
    destinationParam: string | undefined;
    isCommuter: boolean;
    locationRequiredWarningText: string;
    locale: string;
    dateParam: string | null;
}

export default function NavigationUtils({ typeParam, defaultCity, destinationParam, isCommuter, locationRequiredWarningText, locale, dateParam }: NavigationUtilsProps) {
    const [isDisableRadioButtons, setIsDisableRadioButtons] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [destinationOpen, setDestinationOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const FormSchema = z.object({
        type: z.enum(["departure", "arrival"], {
            required_error: "Please select a destination type.",
        }),
        location: z.string({
            required_error: locationRequiredWarningText,
        }),
        destination: z.string().optional(),
        date: z.date().optional(),
        commuter: z.boolean()
    })

    const initialDefaultValues = {
        type: typeParam ? typeParam : "departure" as TrainDestinationParams,
        location: defaultCity ? decodeURIComponent(defaultCity) : undefined,
        destination: destinationParam ? decodeURIComponent(destinationParam) : undefined,
        date: dateParam ? new Date(dateParam) : new Date(),
        commuter: isCommuter
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            type: initialDefaultValues.type,
            location: undefined,
            destination: undefined,
            date: initialDefaultValues.date,
            commuter: initialDefaultValues.commuter,
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { type, location, destination, date, commuter } = data;
        const sanitizedLocation = encodeURIComponent(location)
        const navigationPath = setNavigationPath(sanitizedLocation, type, commuter, date, destination)
        startTransition(() => {
            router.push(navigationPath);
        });
    }

    function setNavigationPath(
        sanitizedLocation: string,
        type: TrainDestinationParams,
        commuter: boolean,
        date?: Date,
        destination?: string
      ) {
        const params = new URLSearchParams();
      
        // Determine if the provided date is today
        const isToday = date
          ? date.toDateString() === new Date().toDateString()
          : true;
      
        // Set the 'type' parameter
        params.append('type', type);
        params.append('commuter', commuter.toString());
      
        // Add 'destination' if provided
        if (destination) {
          params.append('destination', destination);
        }
      
        // Add 'date' if provided and it's not today
        if (date && !isToday) {
          const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
          params.append('date', formattedDate);
        }
      
        // Construct and return the URL
        return `/${locale}/${sanitizedLocation}?${params.toString()}`;
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