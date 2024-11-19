"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { Accordion } from "../ui/accordion";
import { TrainTypeParam, TransformedTimeTableRow } from "@/lib/types";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
import { LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DualRangeSlider } from "../ui/dual-range-slider";
import { createColumns, epochToHourMinute, epochToISO, setEpochFromTimeString } from "@/lib/utils/tableUtils";
import { Label } from "../ui/label";
import MemoizedTableRow from "./table-components/memoizedTableRow";
import MemoizedEmptyRow from "./table-components/memoizedEmptyTableRow";

export const timeRangeInputId = ["timeStartInput", "timeEndInput"];

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

  const columns = React.useMemo(
    () =>
      createColumns({
        tableType: destinationType,
        locale: locale,
        translation: tTimeTable,
        selectedTrainNumber: selectedTrainNumber,
        setTrainNumber: setTrainNumber,
        sidebarRef: sidebarRef,
      }),
    [destinationType, locale, tTimeTable, selectedTrainNumber, setTrainNumber, sidebarRef]
  );
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

  const column = table.getColumn("scheduledTime");
  const isDisableFilter = data.length < 2;
  const [defaultSliderValues, setDefaultSliderValues] = React.useState([0, 0]);
  const [sliderValues, setSliderValues] = React.useState([0, 0]);

  // Required to re-adjust sliders when user navigates the page
  React.useEffect(() => {
    table.resetColumnFilters();
    const preFilteredRows = table.getSortedRowModel().rows;
    const tableTimeRange = [
      new Date(preFilteredRows[0]?.getValue("scheduledTime")).getTime(),
      new Date(preFilteredRows[preFilteredRows.length - 1]?.getValue("scheduledTime")).getTime(),
    ];

    setDefaultSliderValues(tableTimeRange);
    setSliderValues(tableTimeRange);
  }, [table, data]);

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
      <div className="flex flex-row items-center justify-start">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex flex-row justify-center py-5 rounded-none items-center" variant="outline">
              <span className="">{tTimeTable("timeRangeLabel")}</span>
              <div className="w-6">
                {table.getColumn("scheduledTime")?.getIsFiltered() ? (
                  <span className="bg-black rounded-sm px-1 font-bold text-white">1</span>
                ) : null}
              </div>
              <div className="px-1">
                <ChevronDownIcon></ChevronDownIcon>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className=" w-96 z-[1000]">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{tTimeTable("timeRangeLabel")}</h4>
                <p className="text-sm text-muted-foreground">{tTimeTable("timeRangeDescription")}</p>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-6 gap-2 items-center text-start justify-center">
                  <Label className="col-span-2" htmlFor="minDate">
                    {tTimeTable("minTime")}
                  </Label>
                  <Input
                    disabled={isDisableFilter}
                    type="time"
                    value={epochToHourMinute(sliderValues[0])}
                    onChange={(e) =>
                      setEpochFromTimeString(
                        e.target.value,
                        e.target.id,
                        timeRangeInputId[0],
                        timeRangeInputId[1],
                        defaultSliderValues,
                        sliderValues,
                        setSliderValues
                      )
                    }
                    id={timeRangeInputId[0]}
                    className="col-span-4 h-8"
                  />
                  <Label className="col-span-2" htmlFor="maxDate">
                    {tTimeTable("maxTime")}
                  </Label>
                  <Input
                    disabled={isDisableFilter}
                    type="time"
                    value={epochToHourMinute(sliderValues[1])}
                    onChange={(e) =>
                      setEpochFromTimeString(
                        e.target.value,
                        e.target.id,
                        timeRangeInputId[0],
                        timeRangeInputId[1],
                        defaultSliderValues,
                        sliderValues,
                        setSliderValues
                      )
                    }
                    id={timeRangeInputId[1]}
                    className="col-span-4 h-8"
                  />
                </div>
                <div className="">
                  <DualRangeSlider
                    disabled={isDisableFilter}
                    value={sliderValues}
                    onValueChange={setSliderValues}
                    min={defaultSliderValues[0]}
                    max={defaultSliderValues[1]}
                    step={0.1}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className=" transition-all fade-in"
                    disabled={(sliderValues[0] === defaultSliderValues[0] && sliderValues[1] === defaultSliderValues[1]) || isDisableFilter}
                    onClick={() => column?.setFilterValue([epochToISO(sliderValues[0]), epochToISO(sliderValues[1])])}>
                    {tTimeTable("filter")}
                  </Button>
                  <Button
                    disabled={isDisableFilter}
                    onClick={() => {
                      column?.setFilterValue(undefined);
                      setSliderValues([defaultSliderValues[0], defaultSliderValues[1]]);
                    }}
                    variant="outline">
                    {tTimeTable("reset")}
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
          <TableBody className="border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => <MemoizedTableRow key={row.id} row={row} tTimeTable={tTimeTable} locale={locale} />)
            ) : (
              <MemoizedEmptyRow columns={columns} t={t} />
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
