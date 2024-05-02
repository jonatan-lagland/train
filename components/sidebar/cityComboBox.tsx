"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslations } from "next-intl"

const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
] as const


export function CityComboBoxForm() {
    const t = useTranslations('Navigation');
    const errorLabel: string = t("errorSelectLocation");

    const FormSchema = z.object({
        language: z.string({
            required_error: errorLabel,
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(JSON.stringify(data, null, 2));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
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
                                            {field.value
                                                ? languages.find(
                                                    (language) => language.value === field.value
                                                )?.label
                                                : t("selectCity")}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder={t("searchCity")}
                                            className="h-9"
                                        />
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandList>
                                            <CommandGroup>
                                                {languages.map((language) => (
                                                    <CommandItem
                                                        value={language.label}
                                                        key={language.value}
                                                        onSelect={() => {
                                                            form.setValue("language", language.value)
                                                        }}
                                                    >
                                                        {language.label}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                language.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{t("submitButton")}</Button>
            </form>
        </Form>
    )
}
