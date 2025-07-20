"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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

  const columns = createColumns({
    tableType: destinationType,
    locale: locale,
    translation: tTimeTable,
    selectedTrainNumber: selectedTrainNumber,
    setTrainNumber: setTrainNumber,
    sidebarRef: sidebarRef,
  });

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  const isDisableFilter = data.length < 2;
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length * 2, // Each row has a main row and an accordion row, so we double the count
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => {
      return index % 2 === 0 ? 43 : 58; // even = main row, odd = accordion row
    },
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  React.useEffect(() => {
    const lastVirtualItemIndex = virtualRows[virtualRows.length - 1]?.index;
    if (lastVirtualItemIndex !== undefined && lastVirtualItemIndex >= rows.length - 1 - rowVirtualizer.options.overscan) {
    }
  }, [virtualRows, rows.length, rowVirtualizer.options.overscan]);

  return (
    <div className="flex flex-col gap-4">
      <TimeFilterComponent rowVirtualizer={rowVirtualizer} table={table} data={data} tTimeTable={tTimeTable} isDisableFilter={isDisableFilter} />
      <div ref={tableContainerRef} style={{ height: "400px", position: "relative", overflow: "auto" }} className="border bg-background">
        <Table>
          <TableHeader
            className="bg-background"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
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
          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
              width: "100%",
            }}
          >
            {rows.length > 0 ? (
              virtualRows.map((virtualRow) => {
                const rowIndex = Math.floor(virtualRow.index / 2); // Get the index of the actual data row
                const isAccordionRow = virtualRow.index % 2 === 1; // Check if it's the second (accordion) row
                const row = rows[rowIndex];
                if (!row) return null;
                const key = `${row.id}-${isAccordionRow ? "accordion" : "main"}`;
                const { liveEstimateTime, cancelled, scheduledTime } = row.original;
                const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : new Date(scheduledTime).getTime();
                const isGreyBg = liveDateTime < Date.now() || cancelled;
                const rowBgClass = isGreyBg ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-white bg-white";
                if (isAccordionRow) {
                  return (
                    <TableRow
                      key={key}
                      data-index={virtualRow.index}
                      ref={(node) => {
                        requestAnimationFrame(() => {
                          rowVirtualizer.measureElement(node);
                        });
                      }}
                      style={{
                        position: "absolute",
                        transform: `translateY(${virtualRow.start}px)`,
                        width: "100%",
                      }}
                      className={`transition-all fade-in ${rowBgClass}`}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      <TableCell
                        style={{
                          width: table.getAllFlatColumns().reduce((acc, column) => acc + column.getSize(), 0),
                        }}
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem className="border-none w-full" value={row.id}>
                            <AccordionTrigger
                              aria-label={`${tTimeTable("ariaExpandButton")} ${row.original.trainType} ${row.original.trainNumber}`}
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
                  );
                } else {
                  return (
                    <TableRow
                      key={key}
                      ref={(node) => {
                        requestAnimationFrame(() => {
                          rowVirtualizer.measureElement(node);
                        });
                      }}
                      style={{
                        position: "absolute",
                        transform: `translateY(${virtualRow.start}px)`,
                        width: "100%",
                      }}
                      data-index={virtualRow.index}
                      className={`transition-all fade-in border-b-0 ${rowBgClass}`}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
                  );
                }
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
