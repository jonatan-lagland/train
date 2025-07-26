"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { TimeTableRow, TrainTypeParam, TransformedTimeTableRow } from "@/lib/types";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
import { LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import { createColumns } from "@/lib/utils/tableUtils";
import TimetableEmptyRow from "./table-components/timetableEmptyRow";
import TimeFilterComponent from "./table-components/timeFilterComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import JourneyItem from "./table-components/journeyItem";
import StationNumberFilterComponent from "./table-components/stationNumberFilterComponent";

export type TimeTableProps = {
  data: TransformedTimeTableRow[];
  destinationType: TrainTypeParam;
};

export function TimeTableComponent({ data, destinationType }: TimeTableProps) {
  const { selectedTrainNumber, setTrainNumber, sidebarRef } = React.useContext(SelectedTrainContext);
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "scheduledTime", desc: false }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const tTimeTable = useTranslations("TimeTable");
  const locale = useLocale() as LocaleNextIntl;
  const [isOpen, setIsOpen] = React.useState(false);

  const columns = createColumns({
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    data: data,
    destinationType: destinationType,
    tableType: destinationType,
    locale: locale,
    translation: tTimeTable,
    selectedTrainNumber: selectedTrainNumber,
    setTrainNumber: setTrainNumber,
    sidebarRef: sidebarRef,
  });

  const isDisableFilter = data.length < 2;
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const buttonsRowRef = React.useRef<HTMLDivElement>(null);
  const [headerOffset, setHeaderOffset] = React.useState(0);

  React.useEffect(() => {
    const updateOffset = () => {
      if (buttonsRowRef.current) {
        setHeaderOffset(buttonsRowRef.current.offsetHeight);
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [buttonsRowRef]);

  return (
    <div ref={tableContainerRef} className="flex flex-col gap-2">
      <div
        ref={buttonsRowRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
        className="flex flex-wrap gap-1 items-center justify-start primary"
      >
        <StationNumberFilterComponent table={table} tTimeTable={tTimeTable}></StationNumberFilterComponent>
        <TimeFilterComponent table={table} data={data} tTimeTable={tTimeTable} isDisableFilter={isDisableFilter} />

        <div className="md:hidden flex justify-center items-center"></div>
      </div>
      <div className="border bg-background">
        <Table>
          <TableHeader
            style={{
              position: "sticky",
              top: headerOffset,
              zIndex: 1,
            }}
            className="bg-background"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }} className="text-secondary-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const { liveEstimateTime, cancelled, scheduledTime, trainNumber } = row.original;
                const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : new Date(scheduledTime).getTime();
                const isPastTime = liveDateTime < Date.now() || cancelled;
                const dataState = isPastTime ? "disabled" : selectedTrainNumber === trainNumber ? "selected" : "default";

                return (
                  <React.Fragment key={`${row.id}-fragment`}>
                    <TableRow data-state={dataState} key={row.id} className={`transition-all fade-in border-b-0`}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          style={{
                            width: cell.column.getSize(),
                          }}
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow data-state={dataState} key={`${row.id}-accordion`} className={`transition-all fade-in`}>
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        style={{
                          width: "100%",
                        }}
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem className="border-none w-full" value={row.id}>
                            <AccordionTrigger
                              style={{
                                width: "100%",
                              }}
                              aria-label={`${row.original.trainType} ${row.original.trainNumber}: ${tTimeTable("ariaExpandButton")}`}
                              className="flex-row justify-center gap-2 items-center p-3"
                            ></AccordionTrigger>
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
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TimetableEmptyRow columns={columns} t={t} />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
