"use client";
import React, { useContext } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { StationMetadataContext } from "@/lib/context/StationMetadataContext";
import NavigationComponent from "./navigationComponent";
import { TrainTypeParam } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type NavigationContainerProps = {
  isNotFoundPage?: boolean; // isNotFoundPage indicates whether the page in question is the 404 page. No title is rendered on that page.
  title?: string;
  size?: "small" | "large";
};

function NavigationContainer({ isNotFoundPage, title, size }: NavigationContainerProps) {
  const stationMetadata = useContext(StationMetadataContext);
  const locale = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const defaultCity = isNotFoundPage ? undefined : (params.city as string);
  const destinationParam = isNotFoundPage ? undefined : (searchParams.get("destination") as string);
  const typeParam = searchParams.get("type") as TrainTypeParam;
  const commuterParam = searchParams.get("commuter");
  const dateParam = searchParams.get("date");
  const isCommuter = commuterParam?.toLowerCase() === "true" ? true : false; // search params are treated as a string
  const tTimeTable = useTranslations("TimeTable");

  const componentProps = {
    title,
    locale,
    stationMetadata,
    defaultCity,
    destinationParam,
    typeParam,
    isCommuter,
    dateParam,
  };

  if (size === "small") {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem className="border-none w-full" value="navigation">
          <AccordionTrigger>
            <div className="flex items-center justify-center w-full text-center">
              <span className="text-sm font-medium text-white">{tTimeTable("city")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-center justify-center">
            <NavigationComponent {...componentProps} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    return <NavigationComponent {...componentProps} />;
  }
}

export default NavigationContainer;
