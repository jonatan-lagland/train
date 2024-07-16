"use client"

import * as React from "react"
import {
    CaretSortIcon,
} from "@radix-ui/react-icons"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useLocale, useTranslations } from 'next-intl';

export type TrainDestination = "ARRIVAL" | "DEPARTURE" | undefined;

export type TimeTable = {
    stationName: string
    type: TrainDestination;
    scheduledTime: string
    scheduledFinalDestination: string
    trainType: string
    trainNumber: number
    differenceInMinutes?: number
    commercialTrack: number
}

export type TimeTableProps = {
    data: TimeTable[]
    destination: TrainDestination
}

type CreateColumnsProps = {
    tableType: TrainDestination
    locale: any
    translation: any
}

// Workaround for useLocale not returning a full time format and causing issues with the swedish format.
const localeMap: Record<string, string> = {
    en: 'en-US',
    se: 'sv-SE',
    fi: 'fi-FI',
};

export const createColumns = ({ tableType, locale, translation }: CreateColumnsProps): ColumnDef<TimeTable>[] => {
    return [
        {
            accessorKey: "trainType",
            header: () => {
                return (
                    <div className="flex flex-row justify-center items-end">
                        {translation('train')}
                    </div>
                )

            },
            cell: ({ row }) => {
                const { trainType, trainNumber } = row.original;
                return <div className="text-start">{`${trainType} ${trainNumber}`}</div>
            },
        },
        {
            accessorKey: "commercialTrack",
            header: () => {
                return (
                    <div className="flex flex-row justify-center items-end">
                        {translation(`track`)}
                    </div>
                )
            },
            cell: ({ row }) => {
                const commercialTrack = row.getValue("commercialTrack") as string;
                return <div className="text-center font-semibold">{commercialTrack}</div>
            },
        },
        {
            accessorKey: "stationName",
            header: () => {
                return (
                    <span>
                        {translation(`destination`)}
                    </span>
                )
            },
            cell: ({ row }) => {
                const stationName = row.getValue("stationName") as string;
                return <div className="text-start ps-1 font-semibold">{stationName}</div>
            },
        },
        {
            accessorKey: "scheduledTime",
            header: ({ column }) => {
                if (!tableType) return null;
                const tableTypeFormatted = tableType.toLowerCase();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <div className="flex flex-row bg-white border rounded-full px-6 py-2 justify-center items-end">
                            {translation(`${tableTypeFormatted}`)}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </div>
                    </Button>
                )
            },
            cell: ({ row }) => {
                const scheduledTime: string = row.getValue("scheduledTime") as string;
                const { scheduledFinalDestination } = row.original;

                if (!scheduledFinalDestination) return null; // Exit early to avoid errors with converting undefined timestamps

                const dateTime: Date = new Date(scheduledTime);
                const dateTimeFinalDestination: Date = new Date(scheduledFinalDestination);
                const currentLocaleFull = localeMap[locale] || 'fi-FI'; // Convert to full timestamp

                // Covert date object into a localized timestamp
                const formatter = new Intl.DateTimeFormat(currentLocaleFull, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const timeStamp: string = formatter.format(dateTime);
                const timeStampFinalDestination: string = formatter.format(dateTimeFinalDestination);

                const timeDifference = dateTimeFinalDestination.getTime() - dateTime.getTime();
                const totalMinutes = Math.floor(timeDifference / 60000);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                const travelTime = hours > 0
                    ? `${hours} ${translation('shortHour')} ${minutes} ${translation('shortMin')}`
                    : `${minutes} ${translation('shortMin')}`;

                if (!tableType) return null;
                const tableTypeFormatted = tableType.toLowerCase();

                return (
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-end items-center lowercase">
                            <div className="flex flex-row items-center">
                                <span className="font-bold">
                                    {timeStamp}
                                </span>
                                {totalMinutes > 0 ?
                                    <>
                                        <ArrowRightAltIcon style={{ color: 'grey' }} />
                                        <span className="font-medium">
                                            {timeStampFinalDestination}
                                        </span>
                                    </>
                                    : null}
                            </div>
                            {totalMinutes > 0 ?
                                <span className=" text-gray-500">
                                    ({travelTime})
                                </span>
                                : null}
                        </div>
                    </div>
                );
            }
        },
    ]
}

export function TimeTable({ data, destination }: TimeTableProps) {
    const t = useTranslations();
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'scheduledTime', desc: false }]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const timetableTranslations = useTranslations('TimeTable');
    const locale = useLocale();
    const columns = createColumns({ tableType: destination, locale: locale, translation: timetableTranslations });
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
    })

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center">
                <Input
                    placeholder={t("TimeTable.placeholder")}
                    value={(table.getColumn("trainType")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("trainType")?.setFilterValue(event.target.value)
                    }
                    className=""
                />
            </div>
            <div>
                <Table className="border-separate border-spacing-y-2">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className=" bg-white transition duration-300 ease-in-out"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-6 first:rounded-l-xl last:rounded-r-xl last:border-e first:border-s border-y">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (

                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center h-32 flex-1"
                                >
                                    {t('Navigation.searchnotfound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
