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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { Accordion } from "../ui/accordion";
import { TrainTypeParam, TransformedTimeTableRow } from "@/lib/types";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
import { LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import { createColumns } from "@/lib/utils/tableUtils";
import TimetableRow from "./table-components/timetableRow";
import TimetableEmptyRow from "./table-components/timetableEmptyRow";
import TimeFilterComponent from "./table-components/timeFilterComponent";

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

  const isDisableFilter = data.length < 2;
  // Sets page number to where the currently selected train is
  React.useEffect(() => {
    // Use sorted rows to find the index
    const sortedRows = table.getSortedRowModel().rows;
    const rowIndex = sortedRows.findIndex((row) => row.original.trainNumber === selectedTrainNumber);

    if (rowIndex !== -1) {
      const pageIndex = Math.floor(rowIndex / table.getState().pagination.pageSize);
      table.setPageIndex(pageIndex);
    }
  }, [selectedTrainNumber, table]);

  return (
    <div className="flex flex-col gap-10">
      <TimeFilterComponent table={table} data={data} tTimeTable={tTimeTable} isDisableFilter={isDisableFilter}></TimeFilterComponent>
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
          <TableBody className="border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => <TimetableRow key={row.id} row={row} tTimeTable={tTimeTable} locale={locale} />)
            ) : (
              <TimetableEmptyRow columns={columns} t={t} />
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
