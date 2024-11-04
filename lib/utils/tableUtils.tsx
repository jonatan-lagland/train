"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeTable, TimeTableRow, TrainDestination } from "../types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import useTimestampInterval from "@/lib/utils/timestampInterval";
import PlaceIcon from "@mui/icons-material/Place";
import { getJourneyTimeStamp, getLiveEstimateTimestamp, getTimeStamp, LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import Link from "next/link";
import React, { useEffect } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

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
  journey: TimeTable;
  locale: LocaleNextIntl;
};

type CreateColumnsProps = {
  tableType: TrainDestination;
  locale: LocaleNextIntl;
  translation: any;
  selectedTrainNumber: number | undefined;
  setTrainNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  sidebarRef: React.RefObject<HTMLDivElement>;
};

/**
 * Component that returns a styled icon and applies a color to it based on a train's current and future scheduled time.
 *
 * @param {number} param.currentScheduledTime The scheduled time of the current journey in milliseconds.
 * @param {number} param.nextScheduledTime The scheduled time of the journey after the current journey in milliseconds.
 */
export const ColorIcon = ({ currentScheduledTime, nextScheduledTime, cancelled }: ColorIconProps) => {
  const currentTime = useTimestampInterval();
  const isOnGoingTrain = nextScheduledTime && currentTime >= currentScheduledTime && currentTime < nextScheduledTime;
  const isPassedTrain = currentTime > currentScheduledTime;

  if (cancelled) {
    return <div className="rounded-full absolute w-3 h-3 bg-red-800"></div>;
  }

  if (isOnGoingTrain) {
    return <Skeleton className="rounded-full absolute w-3 h-3 bg-yellow-500" />;
  }
  if (isPassedTrain) {
    return (
      <>
        <div className="rounded-full absolute w-3 h-3 bg-green-800" />
        <div className="w-1 bg-green-800 h-full"></div>
      </>
    );
  }
  // Return gray icon by default to signal a journey has not been started or completed
  return (
    <>
      <div className="rounded-full absolute w-3 h-3 bg-neutral-400" />
      <div className="w-1 bg-neutral-400 h-full"></div>
    </>
  );
};

/**
 * Provides a Next.js link with legacy behavior that allows links to open in another browser tab.
 */
export const ExternalLink = ({ href, className, children }: ExternalLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className={`${className}`} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Link>
  );
};

/**
 * Component that returns either a colored icon, a link with a timestamp or an arrow pointing right
 * depending on the index of the list of station arrival and departure items.
 *
 * @param {number} param.index Current index of the list of items
 * @param {Row<TimeTable>} param.timeTableRow An array of all possible journeys, used to compare the current timestamp with the next scheduled timestamp.
 * @param {TimeTable} param.journey TimeTable object of the current index's journey.
 * @param {("en | se | fi")} param.locale Locale used to set timestamp localization.
 */

export const JourneyItem = ({ index, timeTableRow, journey, locale }: JourneyItemProps) => {
  const nextJourney: any = timeTableRow[index + 1];
  const dateTime = new Date(journey.scheduledTime).getTime();
  const cancelled = journey.cancelled;
  const liveEstimateTime = journey.liveEstimateTime ? new Date(journey.liveEstimateTime).getTime() : undefined;
  const liveEstimateTimeStamp = getLiveEstimateTimestamp(liveEstimateTime, dateTime, locale);
  const nextScheduledTime = nextJourney ? new Date(nextJourney.liveEstimateTime ?? nextJourney.scheduledTime).getTime() : null;

  return (
    <React.Fragment key={`fragment-${index}`}>
      {index % 2 === 0 && (
        <>
          <li key={`icon-${index}`} className="flex items-center relative justify-center px-4">
            <ColorIcon currentScheduledTime={liveEstimateTime ?? dateTime} nextScheduledTime={nextScheduledTime} cancelled={cancelled} />
          </li>
          <li key={`station-${index}`} className="flex flex-col items-start justify-center">
            <div className="flex flex-row items-center justify-center gap-1">
              <span className="text-blue-600 font-medium">{journey.stationName}</span>
            </div>
            {liveEstimateTimeStamp ? (
              <div className="flex flex-row gap-1 ">
                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                <span className="">{liveEstimateTimeStamp}</span>
              </div>
            ) : (
              <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
            )}
          </li>
          {index < timeTableRow.length - 1 && (
            <li key={`arrow-${index}`} className="flex items-center justify-center">
              <ArrowRightAltIcon style={{ color: "grey", margin: "0 8px" }} />
            </li>
          )}
        </>
      )}
      {index % 2 !== 0 && (
        <>
          <li key={`station-${index}`} className="flex flex-col items-start justify-center">
            <div className="flex flex-row items-center justify-center gap-1">
              <span className="text-blue-600 font-medium">{journey.stationName}</span>
            </div>
            {liveEstimateTimeStamp ? (
              <div className="flex flex-row gap-1 ">
                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                <span className="">{liveEstimateTimeStamp}</span>
              </div>
            ) : (
              <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
            )}
          </li>
        </>
      )}
    </React.Fragment>
  );
};

export const createColumns = ({
  tableType,
  locale,
  translation,
  selectedTrainNumber,
  setTrainNumber,
  sidebarRef,
}: CreateColumnsProps): ColumnDef<TimeTable>[] => {
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
          <div className="flex flex-col items-center justify-center">
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
      header: ({ column }) => {
        if (!tableType) return null;
        const tableTypeFormatted = tableType.toLowerCase();
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <div className="flex flex-row bg-white border rounded-full px-6 py-2 justify-center items-end">
              {translation(`${tableTypeFormatted}`)}
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </div>
          </Button>
        );
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
 * Hook that sets the table page number to a page where a selected train is located on render.
 * Used when there's stale data that occupies the first page to redirect the user to a desired page.
 *
 * @param {(number | undefined)} selectedTrainNumber
 * @param {Table<TimeTable>} table
 */
export const useTrainPageIndex = (selectedTrainNumber: number | undefined, table: Table<TimeTable>) => {
  useEffect(() => {
    // Use sorted rows to find the index
    const sortedRows = table.getSortedRowModel().rows;
    const rowIndex = sortedRows.findIndex((row) => row.original.trainNumber === selectedTrainNumber);

    if (rowIndex !== -1) {
      const pageIndex = Math.floor(rowIndex / table.getState().pagination.pageSize);
      table.setPageIndex(pageIndex);
    }
  }, [selectedTrainNumber, table]);
};
