"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import sanitizeStationName from "@/lib/utils/sanitizeStationName";
import capitalizeTitle from "@/lib/utils/capitalizeTitle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SpinnerSm } from "../ui/spinner";
import { Check, SwapVert } from "@mui/icons-material";
import { Checkbox } from "../ui/checkbox";
import { StationMetaData, TrainDestinationParams } from "@/lib/types";
import NavigationUtils from "./navigationUtils";
import { useTranslations } from "next-intl";
import { addMonths, format, isSameDay } from "date-fns";
import { Calendar } from "../ui/calendar";
import { localeMapDateFns } from "@/lib/utils/timeStampUtils";

export type NavigationComponentProps = {
  title?: string;
  locale: string;
  stationMetadata: [] | StationMetaData[];
  defaultCity: string | undefined;
  destinationParam: string | undefined;
  typeParam: TrainDestinationParams;
  isCommuter: boolean;
  dateParam: string | null;
};

export default function NavigationComponent(props: NavigationComponentProps) {
  const { title, locale, stationMetadata, defaultCity, destinationParam, typeParam, isCommuter, dateParam } = props;

  const t = useTranslations();
  const locationRequiredWarningText = t("Navigation.errorSelectLocation");

  const navigationUtilsParams = {
    typeParam,
    defaultCity,
    destinationParam,
    dateParam,
    isCommuter,
    locationRequiredWarningText,
    locale,
  };

  const {
    form,
    onSubmit,
    locationValue,
    destinationValue,
    locationOpen,
    setLocationOpen,
    isPending,
    destinationOpen,
    setDestinationOpen,
    isDisableRadioButtons,
  } = NavigationUtils(navigationUtilsParams);

  return (
    <div className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 shadow-md px-6 py-6 bg-white rounded-lg justify-between">
          {title ? <span className="text-4xl font-robotoslab text-start font-semibold">{title}</span> : null}
          <div className="flex flex-row">
            <div className="flex flex-row items-center justify-between gap-1 order-last">
              <Button
                data-testid="swap-stations-button"
                disabled={!locationValue || !destinationValue}
                variant="ghost"
                aria-label={t("Navigation.ariaSwapStation")}
                onClick={(e) => {
                  e.preventDefault();
                  const currentLocation = form.getValues("location");
                  const currentDestination = form.getValues("destination") as string;
                  form.setValue("location", currentDestination);
                  form.setValue("destination", currentLocation);
                }}>
                <SwapVert color="action" />
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 items-start">
                    <div className=" h-4">
                      <FormMessage></FormMessage>
                    </div>
                    <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            data-testid="select-departure-station-button"
                            disabled={isPending}
                            variant="outline"
                            aria-label={t("TimeTable.nextDeparture")}
                            role="combobox"
                            className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
                            <span className="truncate">{field.value ? capitalizeTitle(field.value) : t("TimeTable.origin")}</span>
                            <div className="flex flex-row justify-end">
                              {field.value && (
                                <Cross2Icon
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.resetField("location");
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
                                const sanitizedStationName = sanitizeStationName(station.stationName);
                                return (
                                  <CommandItem
                                    role="option"
                                    key={station.stationShortCode}
                                    value={sanitizedStationName}
                                    onSelect={() => {
                                      form.setValue("location", sanitizedStationName);
                                      setLocationOpen(false);
                                    }}>
                                    <Check
                                      className={cn("mr-2 h-4 w-4", station.stationShortCode === field.value ? "opacity-100" : "opacity-0")}
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
                  <FormItem className="flex flex-col gap-1">
                    <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            data-testid="select-destination-station-button"
                            disabled={isPending}
                            variant="outline"
                            aria-label={t("TimeTable.nextDestination")}
                            role="combobox"
                            className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
                            <span className="truncate">{field.value ? capitalizeTitle(field.value) : t("TimeTable.destination")}</span>
                            <div className="flex flex-row justify-end">
                              {field.value && (
                                <Cross2Icon
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.resetField("destination");
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
                                const sanitizedStationName = sanitizeStationName(station.stationName);
                                return (
                                  <CommandItem
                                    key={station.stationShortCode}
                                    value={sanitizedStationName}
                                    onSelect={() => {
                                      form.setValue("destination", sanitizedStationName);
                                      setDestinationOpen(false);
                                    }}>
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          (!field.value || isSameDay(field.value, new Date())) && "text-muted-foreground"
                        )}>
                        {field.value
                          ? isSameDay(field.value, new Date())
                            ? t("Navigation.today")
                            : format(field.value, "PPP", { locale: localeMapDateFns[locale] })
                          : t("Navigation.selectDate")}
                        <div className="flex flex-row justify-end">
                          {field.value && !isSameDay(field.value, new Date()) && (
                            <Cross2Icon
                              className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                form.resetField("date");
                              }}
                            />
                          )}
                        </div>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      fromMonth={new Date()}
                      toMonth={addMonths(new Date(), 6)}
                      locale={localeMapDateFns[locale]}
                      mode="single"
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        const dateToCheck = new Date(date);
                        const sixMonthsFromToday = addMonths(today, 6);

                        // Set the time to 00:00:00 to avoid time issues in comparison
                        today.setHours(0, 0, 0, 0);
                        dateToCheck.setHours(0, 0, 0, 0);
                        sixMonthsFromToday.setHours(0, 0, 0, 0);

                        return dateToCheck < today || dateToCheck > sixMonthsFromToday;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commuter"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-start items-center space-y-0 gap-3">
                <FormControl>
                  <Checkbox
                    disabled={isPending}
                    aria-labelledby="form-label-commuter"
                    defaultChecked={field.value}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel id="form-label-commuter" className="font-normal">
                  {t("Navigation.commuterRail")}
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="flex flex-grow flex-col gap-3 justify-between">
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
                      className="flex flex-col space-y-1">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem aria-labelledby="form-label-outgoing" value="departure" />
                        </FormControl>
                        <FormLabel id="form-label-outgoing" className="font-normal">
                          {t("TimeTable.outgoing")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem aria-labelledby="form-label-incoming" value="arrival" />
                        </FormControl>
                        <FormLabel id="form-label-incoming" className="font-normal">
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
          <Button disabled={isPending} type="submit">
            {isPending ? <SpinnerSm></SpinnerSm> : t("Navigation.search")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
