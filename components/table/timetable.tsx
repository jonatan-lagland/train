"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { TimeTableRow, TrainDestination, TimeTable } from "@/lib/types";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
import { LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import { createColumns, JourneyItem, useTrainPageIndex } from "@/lib/utils/tableUtils";

export type TimeTableProps = {
  data: TimeTable[];
  destinationType: TrainDestination;
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
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  useTrainPageIndex(selectedTrainNumber, table);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center">
        <Input
          placeholder={t("TimeTable.placeholder")}
          value={(table.getColumn("stationName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("stationName")?.setFilterValue(event.target.value)}
          className=""
        />
      </div>
      <Accordion type="single" collapsible>
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-2  text-secondary-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow className="border-none hover:bg-inherit" data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pt-8 h-28">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="hover:bg-inherit">
                    <TableCell className="p-0" colSpan={row.getVisibleCells().length}>
                      <AccordionItem className="border-none" value={row.id}>
                        <AccordionTrigger
                          aria-label={`${tTimeTable("ariaExpandButton")} ${row.original.trainType} ${row.original.trainNumber}`}
                          className="flex-row justify-center gap-2 items-center p-3"></AccordionTrigger>
                        <AccordionContent className="flex flex-col items-center justify-center">
                          <ol className="grid grid-cols-[min-content_min-content_1fr_min-content]">
                            {row.original.trainJourney.map((journey, index) => {
                              return (
                                <JourneyItem
                                  key={index}
                                  index={index}
                                  timeTableRow={row.original.trainJourney as TimeTableRow[]}
                                  journey={journey}
                                  locale={locale}
                                />
                              );
                            })}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-32 flex-1">
                  {t("Navigation.searchnotfound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-start justify-end space-x-2 py-4 ">
          <div className="flex flex-wrap items-center space-x-2">
            <Button
              aria-label={t("Navigation.firstPage")}
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              <FirstPageIcon fontSize="small"></FirstPageIcon>
            </Button>
            <Button
              aria-label={t("Navigation.previousPage")}
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <KeyboardArrowLeftIcon fontSize="small"></KeyboardArrowLeftIcon>
            </Button>
            <div className="flex-1 text-sm text-secondary-foreground">
              <span>
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount() === 0 ? 1 : table.getPageCount()}
              </span>
            </div>
            <Button
              aria-label={t("Navigation.nextPage")}
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <KeyboardArrowRightIcon fontSize="small"></KeyboardArrowRightIcon>
            </Button>
            <Button
              aria-label={t("Navigation.lastPage")}
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <LastPageIcon fontSize="small"></LastPageIcon>
            </Button>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
