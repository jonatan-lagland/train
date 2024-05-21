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
import { useFormatter, useLocale, useTimeZone, useNow, useTranslations } from 'next-intl';
import { Train } from "@/lib/types"

export type TrainDestination = "ARRIVAL" | "DEPARTURE";

export type TimeTable = {
    stationName: string
    type: TrainDestination;
    scheduledTime: string
    trainType: string
    trainNumber: number
    differenceInMinutes?: number
}

export type TimeTableProps = {
    data: TimeTable[]
    destination: TrainDestination;
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
            accessorKey: "stationName",
            header: ({ column }) => {
                return (
                    <div className="text-start font-besley">
                        <Button
                            className="p-1"
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {translation(`destination`)}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const stationName = row.getValue("stationName") as string;
                return <div className="text-start ps-1 font-semibold">{stationName}</div>
            },
        },
        {
            accessorKey: "trainType",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row justify-start items-end font-besley">
                        <Button
                            className="p-1"
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {translation('train')}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )

            },
            cell: ({ row }) => {
                const { trainType, trainNumber } = row.original;
                return <div className="text-start">{`${trainType} ${trainNumber}`}</div>
            },
        },
        {
            accessorKey: "scheduledTime",
            header: ({ column }) => {
                const tableTypeFormatted = tableType.toLowerCase();
                return (
                    <div className="flex flex-row justify-end items-end font-besley">
                        <Button
                            className="p-1"
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            {translation(`${tableTypeFormatted}`)}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const isoDateString: string = row.getValue("scheduledTime") as string;
                const dateTime: Date = new Date(isoDateString);
                const currentLocaleFull = localeMap[locale] || 'fi-FI'; // Convert to full timestamp

                // Covert date object into a localized timestamp
                const formatter = new Intl.DateTimeFormat(currentLocaleFull, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const timeStamp: string = formatter.format(dateTime);
                return <div className="lowercase text-end">{timeStamp}</div>;
            }
        },
    ]
}

export function TimeTable({ data, destination }: TimeTableProps) {
    const t = useTranslations();
    const [sorting, setSorting] = React.useState<SortingState>([])
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
        <div className="w-full h-full bg-white p-4 shadow-md rounded-b-sm px-6">
            <div className="flex items-center py-4">
                <Input
                    placeholder={t("TimeTable.placeholder")}
                    value={(table.getColumn("stationName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("stationName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center"
                                >
                                    {t('Navigation.searchnotfound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-start space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t('Navigation.previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t('Navigation.next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
