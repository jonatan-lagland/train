import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { Dispatch, SetStateAction } from "react";
import { CalendarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { epochToHourMinute, epochToISO, setEpochFromTimeString } from "@/lib/utils/tableUtils";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Column, Table } from "@tanstack/react-table";
import { TransformedTimeTableRow } from "@/lib/types";
import { useCalculateWindowSize } from "@/lib/utils/calculateWindowSize";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Virtualizer } from "@tanstack/react-virtual";

export const timeRangeInputId = ["timeStartInput", "timeEndInput"];

type TimeFilterComponentProps = {
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  table: Table<TransformedTimeTableRow>;
  data: TransformedTimeTableRow[];
  tTimeTable: any;
  isDisableFilter: boolean;
};

type TimeFilterComponentContentProps = {
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  tTimeTable: any;
  isDisableFilter: boolean;
  sliderValues: number[];
  defaultSliderValues: number[];
  setSliderValues: Dispatch<SetStateAction<number[]>>;
  column: Column<TransformedTimeTableRow, unknown> | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const TimeFilterComponentContent = ({
  rowVirtualizer,
  tTimeTable,
  isDisableFilter,
  sliderValues,
  defaultSliderValues,
  setSliderValues,
  column,
  setOpen,
}: TimeFilterComponentContentProps) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <span className="font-medium leading-none">{tTimeTable("timeRangeLabel")}</span>
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
            className="transition-all fade-in"
            disabled={(sliderValues[0] === defaultSliderValues[0] && sliderValues[1] === defaultSliderValues[1]) || isDisableFilter}
            onClick={() => {
              column?.setFilterValue([epochToISO(sliderValues[0]), epochToISO(sliderValues[1])]);
              setOpen(false);
              rowVirtualizer.scrollToIndex(0, { align: "start" });
            }}
          >
            {tTimeTable("filter")}
          </Button>
          <Button
            disabled={isDisableFilter}
            onClick={() => {
              column?.setFilterValue(undefined);
              setSliderValues([defaultSliderValues[0], defaultSliderValues[1]]);
              setOpen(false);
              rowVirtualizer.scrollToIndex(0, { align: "start" });
            }}
            variant="outline"
          >
            {tTimeTable("reset")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TimeFilterComponent = ({ rowVirtualizer, table, data, tTimeTable, isDisableFilter }: TimeFilterComponentProps) => {
  const column = table.getColumn("scheduledTime");
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

  const { isSmallerThanBreakPoint } = useCalculateWindowSize();

  const [open, setOpen] = React.useState(false);

  return (
    <>
      {isSmallerThanBreakPoint ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button className="flex flex-row justify-center py-5 gap-1 items-center" variant="outline">
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              <span className="">{tTimeTable("timeRangeLabel")}</span>
              <div className="w-6">
                {table.getColumn("scheduledTime")?.getIsFiltered() ? <span className="bg-black rounded-sm px-1 font-bold text-white">1</span> : null}
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-2">
            <TimeFilterComponentContent
              rowVirtualizer={rowVirtualizer}
              tTimeTable={tTimeTable}
              isDisableFilter={isDisableFilter}
              sliderValues={sliderValues}
              defaultSliderValues={defaultSliderValues}
              setSliderValues={setSliderValues}
              column={column}
              setOpen={setOpen}
            ></TimeFilterComponentContent>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="flex flex-row justify-center py-5 rounded-none items-center" variant="outline">
              <span className="">{tTimeTable("timeRangeLabel")}</span>
              <div className="w-6">
                {table.getColumn("scheduledTime")?.getIsFiltered() ? <span className="bg-black rounded-sm px-1 font-bold text-white">1</span> : null}
              </div>
              <div className="px-1">
                <ChevronDownIcon></ChevronDownIcon>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className=" z-[1000]">
            <TimeFilterComponentContent
              rowVirtualizer={rowVirtualizer}
              tTimeTable={tTimeTable}
              isDisableFilter={isDisableFilter}
              sliderValues={sliderValues}
              defaultSliderValues={defaultSliderValues}
              setSliderValues={setSliderValues}
              column={column}
              setOpen={setOpen}
            ></TimeFilterComponentContent>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default TimeFilterComponent;
