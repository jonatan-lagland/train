"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { TransformedTimeTableRow, TimeTableRow, TrainTypeParam } from "../types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import useTimestampInterval from "@/lib/utils/timestampInterval";
import PlaceIcon from "@mui/icons-material/Place";
import { getJourneyTimeStamp, getLiveEstimateTimestamp, getTimeStamp, LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Column, ColumnDef, FilterFnOption, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ColorIconProps = {
  currentScheduledTime: number;
  nextScheduledTime: number | null;
  cancelled: boolean;
};

type ExternalLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

type JourneyItemProps = {
  index: number;
  timeTableRow: TimeTableRow[];
  journey: TransformedTimeTableRow;
  locale: LocaleNextIntl;
};

type CreateColumnsProps = {
  tableType: TrainTypeParam;
  locale: LocaleNextIntl;
  translation: any;
  selectedTrainNumber: number | undefined;
  setTrainNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  sidebarRef: React.RefObject<HTMLDivElement>;
};

export const inTimeRange: FilterFnOption<TransformedTimeTableRow> = (
  row,
  columnId: string,
  filterValue: [number, number] // Epoch time range in milliseconds
) => {
  const [minISO, maxISO] = filterValue;

  const rowValue = row.getValue<string>(columnId);
  const rowEpoch = new Date(rowValue).getTime();
  const minEpoch = new Date(minISO).getTime();
  const maxEpoch = new Date(maxISO).getTime();
  return rowEpoch >= minEpoch && rowEpoch <= maxEpoch;
};

export const createColumns = ({
  tableType,
  locale,
  translation,
  selectedTrainNumber,
  setTrainNumber,
  sidebarRef,
}: CreateColumnsProps): ColumnDef<TransformedTimeTableRow>[] => {
  const handleButtonClick = (trainNumber: number) => {
    setTrainNumber(trainNumber);
    if (sidebarRef.current) {
      sidebarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return [
    {
      accessorKey: "trainType",
      header: () => {
        return <div className="flex flex-row justify-center items-end">{translation("train")}</div>;
      },
      cell: ({ row }) => {
        const { trainType, trainNumber, liveEstimateTime, scheduledTime, cancelled } = row.original;
        const iconColor = selectedTrainNumber === trainNumber ? "#3e64ed" : "#646770";
        const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : new Date(scheduledTime).getTime();
        const isButtonDisabled = liveDateTime < Date.now() || cancelled;

        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Button
              aria-label={`${translation("ariaMapViewButton")} ${trainType} ${trainNumber}`}
              disabled={isButtonDisabled}
              variant={"ghost"}
              onClick={() => handleButtonClick(trainNumber)}>
              <PlaceIcon style={{ fill: iconColor }}></PlaceIcon>
            </Button>
            <span>{`${trainType} ${trainNumber}`}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "commercialTrack",
      header: () => {
        return <div className="flex flex-row justify-center items-end">{translation(`track`)}</div>;
      },
      cell: ({ row }) => {
        const commercialTrack = row.getValue("commercialTrack") as string;
        return <div className="text-center font-semibold">{commercialTrack}</div>;
      },
    },
    {
      accessorKey: "stationName",
      header: () => {
        if (!tableType) return null;
        const tableTypeFormatted = tableType.toLowerCase();

        return <span>{tableTypeFormatted === "arrival" ? translation(`origin`) : translation(`destination`)}</span>;
      },
      cell: ({ row }) => {
        const stationName = row.getValue("stationName") as string;
        return <div className="text-start ps-1 font-semibold">{stationName}</div>;
      },
    },
    {
      accessorKey: "scheduledTime",
      filterFn: inTimeRange,
      enableColumnFilter: true, // Ensure column filtering is enabled
      header: () => {
        if (!tableType) return null;
        const tableTypeFormatted = tableType.toLowerCase();
        return <div className="flex flex-row justify-center items-end">{translation(`${tableTypeFormatted}`)}</div>;
      },
      cell: ({ row }) => {
        const scheduledTime: string = row.getValue("scheduledTime") as string;
        const { scheduledFinalDestination } = row.original;
        const { liveEstimateTime } = row.original;
        const { unknownDelay } = row.original;
        const { cancelled } = row.original;
        const cancelledStyle = cancelled ? "text-red-700 line-through" : "";
        const cancelledTimeStyle = cancelled ? "text-red-700 line-through" : "text-gray-500";

        if (!scheduledFinalDestination) return null; // Exit early to avoid errors with converting undefined timestamps
        if (!tableType) return null;

        const { timeStamp, liveTimeStamp, totalMinutes, timeStampFinalDestination, travelTime } = getTimeStamp(
          scheduledTime,
          liveEstimateTime,
          scheduledFinalDestination,
          locale,
          translation
        );

        return (
          <div className="flex justify-center">
            <div className="flex flex-col justify-end items-center lowercase">
              {cancelled ? <span className="capitalize font-bold">{translation("cancelled")}</span> : null}
              <div className={`flex flex-row items-center ${cancelledStyle}`}>
                {liveTimeStamp || unknownDelay ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="font-medium line-through text-red-700">{timeStamp}</span>
                    <span className="font-bold">{unknownDelay && !liveTimeStamp ? "?" : liveTimeStamp}</span>
                  </div>
                ) : (
                  <span className="font-bold">{timeStamp}</span>
                )}
                {totalMinutes > 0 ? (
                  <>
                    <ArrowRightAltIcon style={{ color: "grey" }} />
                    <span className="font-medium">{timeStampFinalDestination}</span>
                  </>
                ) : null}
              </div>
              {totalMinutes > 0 ? <span className={`${cancelledTimeStyle}`}>({travelTime})</span> : null}
            </div>
          </div>
        );
      },
    },
  ];
};

/**
 * Converts a number in Unix Epoch format to a string in ISO 8601 format.
 *
 * @export
 * @param {number} epoch A number in Unix Epoch format
 * @returns {string} A string in ISO 8601 format
 */
export function epochToISO(epoch: number): string {
  const date = new Date(epoch);
  return date.toISOString();
}

/**
 * Converts a number in Unix Epoch format to a string in hh:mm (24-hour format).
 *
 * @export
 * @param {number} epoch A number in Unix Epoch format
 * @returns {string} A string in hh:mm (24-hour format)
 */
export function epochToHourMinute(epoch: number): string {
  const date = new Date(epoch);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Sets the Epoch numbers of the sliderValues state hook when a value is selected from a time input field.
 * Takes into account which input was used and the minimum and maximum allowed values
 * to adjust the state accordingly.
 *
 * @export
 * @param {string} timeString A string in hh:mm (24-hour format) (example: e.target.value => "16:32")
 * @param {string} currentId The id of the selected input field (example: e.target.id => "timeStartInput")
 * @param {string} startId The id of the start input field (example: "timeStartInput")
 * @param {string} endId The id of the end input field (example: "timeEndInput")
 * @param {number[]} defaultSliderValues The min and max accepted values for the input, in Epoch format (example: [1731932340000, 1731963120000])
 * @param {number[]} sliderValues The currently selected values of the sliderValues state hook (example: [1731932340000, 1731963120000])
 * @param {React.Dispatch<React.SetStateAction<number[]>>} setSliderValues The setter function for the sliderValues state hook
 */
export function setEpochFromTimeString(
  timeString: string,
  currentId: string,
  startId: string,
  endId: string,
  defaultSliderValues: number[],
  sliderValues: number[],
  setSliderValues: React.Dispatch<React.SetStateAction<number[]>>
) {
  if (currentId != startId && currentId != endId) {
    throw new Error(`Invalid input id. Expected value of inputId is "${startId}" or "${endId}". Provided: "${currentId}""`);
  }

  if (!/^(2[0-3]|1[0-9]|0[0-9]):[0-5][0-9]$/.test(timeString)) {
    throw new Error(`Invalid time format. Expected format is in hh:mm (24-hour format). Provided: "${timeString}"`);
  }

  if (sliderValues.length !== 2) {
    throw new Error(`Invalid current slider values. Expected a number[] with a length of 2. Provided: "${sliderValues}"`);
  }

  if (defaultSliderValues.length !== 2) {
    throw new Error(`Invalid default slider values. Expected a number[] with a length of 2. Provided: "${defaultSliderValues}"`);
  }

  // At most there are two days to be extracted, for example, from November 18th to November 19th.
  // Therefore, two date objects are created from those days.
  // Note that the days can be the same, but this has no effect on the calculation.
  const firstDate = new Date(defaultSliderValues[0]);
  const secondDate = new Date(defaultSliderValues[1]);
  // Date objects are set to midnight
  const userSelectedTimeFirstDay = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), 0, 0, 0);
  const userSelectedTimeSecondDay = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate(), 0, 0, 0);

  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number);
  // Minutes and hours are added to the dates, which have been set to midnight
  userSelectedTimeFirstDay.setHours(hours);
  userSelectedTimeFirstDay.setMinutes(minutes);
  userSelectedTimeSecondDay.setHours(hours);
  userSelectedTimeSecondDay.setMinutes(minutes);
  // Date objects get converted into Epoch numbers, so they may be used in time comparison
  const userSelectedTimeEpochFirstDay = userSelectedTimeFirstDay.getTime();
  const userSelectedTimeEpochSecondDay = userSelectedTimeSecondDay.getTime();

  // Min and Max accepted value extracted from the allowed range
  const [minValue, maxValue] = defaultSliderValues;
  // An appropriate date Epoch is chosen for the start and end values based on whether the time fits within the accepted range
  const startValue = userSelectedTimeEpochSecondDay <= maxValue ? userSelectedTimeEpochSecondDay : userSelectedTimeEpochFirstDay;
  const endValue = userSelectedTimeEpochFirstDay >= minValue ? userSelectedTimeEpochFirstDay : userSelectedTimeEpochSecondDay;

  if (currentId === startId) {
    // User selection is clamped to smallest accepted value, if outside of bounds
    const startValueClamped = Math.max(minValue, startValue);
    const newMin = Math.min(startValueClamped, maxValue);
    const newMax = Math.max(startValueClamped, sliderValues[1]);
    setSliderValues([newMin, newMax]);
  }

  if (currentId === endId) {
    // User selection is clamped to largest accepted value, if outside of bounds
    const endValueClamped = Math.min(maxValue, endValue);
    const newMin = Math.min(sliderValues[0], endValueClamped);
    const newMax = Math.max(endValueClamped, minValue);
    setSliderValues([newMin, newMax]);
  }
}
