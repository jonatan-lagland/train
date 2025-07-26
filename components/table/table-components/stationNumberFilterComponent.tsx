import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { TransformedTimeTableRow } from "@/lib/types";
import { useCalculateWindowSize } from "@/lib/utils/calculateWindowSize";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";

export const timeRangeInputId = ["timeStartInput", "timeEndInput"];

type TimeFilterComponentProps = {
  table: Table<TransformedTimeTableRow>;
  tTimeTable: any;
};

type StationNumberFilterComponentContentProps = {
  tTimeTable: any;
  form: UseFormReturn<
    {
      trainTypes: string[];
    },
    any,
    undefined
  >;
  trainOptions: string[];
  onSubmit: (values: FormValues) => void;
  handleReset: () => void;
};

const formSchema = z.object({
  trainTypes: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

const StationNumberFilterComponentContent = ({ tTimeTable, form, trainOptions, onSubmit, handleReset }: StationNumberFilterComponentContentProps) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="trainTypes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Command>
                  <CommandInput placeholder={tTimeTable("trainNamePlaceholder")} />
                  <CommandList>
                    <CommandEmpty>{tTimeTable("searchnotfound")}</CommandEmpty>
                    <CommandGroup onPointerDown={handlePointerDown} className="h-[200px] overflow-y-auto">
                      {trainOptions.map((type) => {
                        const isSelected = field.value?.includes(type);
                        return (
                          <CommandItem
                            key={type}
                            value={type}
                            onSelect={() => {
                              const selected = field.value || [];
                              const newSelection = isSelected ? selected.filter((item) => item !== type) : [...selected, type];
                              field.onChange(newSelection);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                            <span className="capitalize">{type}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {tTimeTable("filter")}
          </Button>
          <Button type="button" onClick={handleReset} variant="outline">
            {tTimeTable("reset")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const StationNumberFilterComponent = ({ table, tTimeTable }: TimeFilterComponentProps) => {
  const { setTrainNumber } = React.useContext(SelectedTrainContext);
  const { isSmallerThanBreakPoint } = useCalculateWindowSize();
  const [open, setOpen] = React.useState(false);

  const filterValue = table.getColumn("trainType")?.getFilterValue();
  const count = Array.isArray(filterValue) ? filterValue.length : 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainTypes: [],
    },
  });

  const trainOptions = table
    .getPreFilteredRowModel()
    .rows.map((row) => `${row.original.trainType} ${row.original.trainNumber}`)
    .sort((a, b) => {
      const [aType, aNumStr] = a.split(" ");
      const [bType, bNumStr] = b.split(" ");

      // First, compare by train type (e.g., "IC" vs "PYO")
      const typeComparison = aType.localeCompare(bType);
      if (typeComparison !== 0) {
        return typeComparison;
      }

      // If types are the same, compare by train number numerically
      const aNum = parseInt(aNumStr, 10);
      const bNum = parseInt(bNumStr, 10);
      return aNum - bNum;
    });

  function onSubmit(values: FormValues) {
    const filterValues = values.trainTypes;
    table.getColumn("trainType")?.setFilterValue(filterValues && filterValues.length ? filterValues : undefined);
    setOpen(false);

    setTimeout(() => {
      handleSetTrainNumber();
    }, 0);
  }

  function handleSetTrainNumber() {
    const filteredRows = table.getFilteredRowModel().rows;
    if (filteredRows.length > 0) {
      const firstTrainNumber = filteredRows[0].original.trainNumber;
      setTrainNumber(firstTrainNumber);
    }
  }

  function handleReset() {
    form.resetField("trainTypes");
    table.getColumn("trainType")?.setFilterValue(undefined);
    setOpen(false);
  }

  return (
    <>
      {isSmallerThanBreakPoint ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button className="flex flex-row justify-center py-5 gap-1 items-center" variant="outline">
              <SearchIcon></SearchIcon>
              <span className="ps-1">{tTimeTable("search")}</span>
              <div className="w-6">
                {table.getColumn("trainType")?.getIsFiltered() ? (
                  <span className="bg-black rounded-sm px-1 font-bold text-white">{count}</span>
                ) : null}
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-2">
            <DrawerTitle className="sr-only">{tTimeTable("train")}</DrawerTitle>
            <DrawerDescription className="sr-only">{tTimeTable("trainNameDescription")}</DrawerDescription>
            <StationNumberFilterComponentContent
              tTimeTable={tTimeTable}
              form={form}
              trainOptions={trainOptions}
              onSubmit={onSubmit}
              handleReset={handleReset}
            ></StationNumberFilterComponentContent>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="flex flex-row justify-center py-5 rounded-none items-center" variant="outline">
              <SearchIcon></SearchIcon>
              <span className="ps-1">{tTimeTable("search")}</span>
              <div className="w-6">
                {table.getColumn("trainType")?.getIsFiltered() ? (
                  <span className="bg-black rounded-sm px-1 font-bold text-white">{count}</span>
                ) : null}
              </div>
              <div className="px-1">
                <ChevronDownIcon></ChevronDownIcon>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className=" z-[1000]">
            <StationNumberFilterComponentContent
              tTimeTable={tTimeTable}
              form={form}
              trainOptions={trainOptions}
              onSubmit={onSubmit}
              handleReset={handleReset}
            ></StationNumberFilterComponentContent>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default StationNumberFilterComponent;
