"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TableCell, TableRow } from "@/components/ui/table";
import { TimeTableRow, TransformedTimeTableRow } from "@/lib/types";
import { LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import { flexRender, Row } from "@tanstack/react-table";
import React from "react";
import JourneyItem from "./journeyItem";

type TimetableRowProps = {
  row: Row<TransformedTimeTableRow>;
  tTimeTable: any;
  locale: LocaleNextIntl;
};

const TimetableRow = ({ row, tTimeTable, locale }: TimetableRowProps) => {
  const { liveEstimateTime, cancelled, scheduledTime } = row.original;
  const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : new Date(scheduledTime).getTime();
  const isGreyBg = liveDateTime < Date.now() || cancelled;
  const rowBgClass = isGreyBg ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-white bg-white";

  return (
    <React.Fragment>
      <TableRow className={`border-none transition-all fade-in ${rowBgClass}`} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="pt-8 h-28">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>

      <TableRow className={`transition-all fade-in ${rowBgClass}`}>
        <TableCell className="p-0" colSpan={row.getVisibleCells().length}>
          <AccordionItem className="border-none" value={row.id}>
            <AccordionTrigger
              aria-label={`${tTimeTable("ariaExpandButton")} ${row.original.trainType} ${row.original.trainNumber}`}
              className="flex-row justify-center gap-2 items-center p-3"></AccordionTrigger>
            <AccordionContent className="flex flex-col items-center justify-center">
              <ol className="grid grid-cols-[min-content_min-content_1fr_min-content]">
                {row.original.trainJourney.map((journey, index) => (
                  <JourneyItem
                    key={index}
                    index={index}
                    timeTableRow={row.original.trainJourney as TimeTableRow[]}
                    journey={journey}
                    locale={locale}
                  />
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TimetableRow;
