"use client";
import React, { useContext } from "react";

import { useLocale, useTranslations } from "next-intl";
import ArrivalTimestamp from "./arrivalTimestamp";
import useSortedStationData from "@/lib/utils/sortedStationData";
import useTimestampInterval from "@/lib/utils/timestampInterval";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteLocale, TrainTypeParam, TransformedTimeTableRow } from "@/lib/types";
import LiveTrainGPS from "./liveTrainGPS";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
import useCommuterLink from "@/lib/utils/commuterLink";

type SidebarProps = {
  data: TransformedTimeTableRow[];
  destinationType: TrainTypeParam;
  size?: "full" | "minimized";
};

function Sidebar({ data, destinationType, size = "full" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const destination = searchParams.get("destination");
  const commuter = searchParams.get("commuter");
  const commuterLink = useCommuterLink(pathname, type, destination, commuter);
  const { selectedTrainNumber, setTrainNumber, sidebarRef } = useContext(SelectedTrainContext);
  const city = params.city as string;
  const locale = useLocale() as SiteLocale;
  const translation = useTranslations("TimeTable");
  const destinationText = destinationType === "arrival" ? translation("nextDeparture") : translation("nextDestination");
  const timeStampNow = useTimestampInterval();
  const nextStation = useSortedStationData(data, selectedTrainNumber, setTrainNumber, timeStampNow, router);
  const { stationNextName, stationNextTrainType, stationNextTrainNumber, stationNextTimestamp, stationNextTrainTrack } = nextStation;

  return (
    <div className={`flex flex-col ${size === "full" ? "px-4 gap-5" : "px-1 gap-2 text-base"} max-w-lg`}>
      <div className="grid grid-rows-[min-content_min_content]">
        {data.length === 0 ? null : (
          <div className={`flex flex-wrap justify-between ${size === "full" ? "py-8" : "py-2"}`}>
            <div className="flex flex-col flex-grow">
              <span className="uppercase font-medium text-slate-600">{destinationText}</span>
              <div className="flex flex-wrap">
                <span className={`font-bold ${size === "full" ? "text-4xl" : "text-2xl"} text-blue-500`}>{stationNextName}</span>
                <div className="flex flex-grow items-center justify-center">
                  <span className={`font-medium ${size === "full" ? "text-xl" : "text-lg"} text-slate-700`}>
                    {stationNextTrainType} {stationNextTrainNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`flex items-center justify-center ${size === "full" ? "text-xl" : "text-base"} min-h-16`}>
          <ArrivalTimestamp
            stationNextTrainType={stationNextTrainType}
            stationNextTrainNumber={stationNextTrainNumber}
            city={city}
            destinationType={destinationType}
            locale={locale}
            stationNextTimestamp={stationNextTimestamp}
            stationNextTrainTrack={stationNextTrainTrack}
            timeStampNow={timeStampNow}
            data={data}
            commuterLink={commuterLink}
          ></ArrivalTimestamp>
        </div>
      </div>
      <div ref={sidebarRef}>
        {size === "minimized" ? (
          <LiveTrainGPS nextStation={nextStation}></LiveTrainGPS>
        ) : (
          <div className="flex flex-col gap-2">
            <LiveTrainGPS nextStation={nextStation}></LiveTrainGPS>
            <div className="text-sm text-slate-600">
              <span className="font-medium">{translation("disclaimerTitle")}: </span>
              <span>{translation("disclaimer")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
