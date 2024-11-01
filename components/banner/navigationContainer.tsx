"use client";
import React, { useContext } from "react";
import { useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { StationMetadataContext } from "@/lib/context/StationMetadataContext";
import NavigationComponent from "./navigationComponent";
import { TrainDestinationParams } from "@/lib/types";

type NavigationContainerProps = {
  isNotFoundPage?: boolean; // isNotFoundPage indicates whether the page in question is the 404 page. No title is rendered on that page.
  title?: string;
};

function NavigationContainer({ isNotFoundPage, title }: NavigationContainerProps) {
  const stationMetadata = useContext(StationMetadataContext);
  const locale = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const defaultCity = isNotFoundPage ? undefined : (params.city as string);
  const destinationParam = isNotFoundPage ? undefined : (searchParams.get("destination") as string);
  const typeParam = searchParams.get("type") as TrainDestinationParams;
  const commuterParam = searchParams.get("commuter");
  const isCommuter = commuterParam?.toLowerCase() === "true" ? true : false; // search params are treated as a string

  const componentProps = {
    title,
    locale,
    stationMetadata,
    defaultCity,
    destinationParam,
    typeParam,
    isCommuter,
  };

  return <NavigationComponent {...componentProps} />;
}

export default NavigationContainer;
