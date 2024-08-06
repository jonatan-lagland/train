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
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlaceIcon from '@mui/icons-material/Place';
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
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Skeleton } from "../ui/skeleton";
import useTimestampInterval from "@/lib/utils/timestampInterval";
import { TimeTableRow, TrainDestination, TimeTable } from "@/lib/types";
import { SelectedTrainContext } from "@/lib/context/SelectedTrainContext";
export type Locale = 'en | se | fi'

export type TimeTableProps = {
    data: TimeTable[]
    destinationType: TrainDestination
}

type CreateColumnsProps = {
    tableType: TrainDestination
    locale: Locale
    translation: any
    selectedTrainNumber: number | undefined
    setTrainNumber: React.Dispatch<React.SetStateAction<number | undefined>>
    sidebarRef: React.RefObject<HTMLDivElement>
}

// Workaround for useLocale not returning a full time format and causing issues with the swedish format.
const localeMap: Record<string, string> = {
    en: 'en-US',
    se: 'sv-SE',
    fi: 'fi-FI',
};

/**
 * Creates a localized timestamp for the scheduled time and the travel time 
 * from point A to point B. 
 * Optionally, provides a localized timestamp for the live estimate time if a value has been provided and the difference
 * between the live estimate time and the previously scheduled time is more than one minute.
 *
 * @param {string} scheduledTime Epoch timestamp of the scheduled train arrival or departure time.
 * @param {(string | undefined)} liveEstimateTime Epoch timestamp of the estimated train arrival of departure time. Used to indicate delay.
 * @param {string} scheduledFinalDestination Epoch timestamp for the final scheduled arrival station in a train's journey.
 * @param {Locale} locale Locale in se | fi | en format.
 * @param {*} translation useTranslations() hook
 */
function getTimeStamp(scheduledTime: string, liveEstimateTime: string | undefined, scheduledFinalDestination: string, locale: Locale, translation: any) {
    const dateTime = new Date(scheduledTime).getTime();
    const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : undefined;
    const liveTimeStamp = getLiveEstimateTimestamp(liveDateTime, dateTime, locale);
    const dateTimeFinalDestination = new Date(scheduledFinalDestination).getTime();

    // Covert date object into a localized timestamp

    const timeStamp = getJourneyTimeStamp(dateTime, locale)
    const timeStampFinalDestination = getJourneyTimeStamp(dateTimeFinalDestination, locale);

    /* 
        * If liveEstimateTime exists, which is used to track train delay, calculate the difference in delay
        * using the scheduled time in when the delay is at least one minute
    */

    const timeDifference = dateTimeFinalDestination - dateTime;
    const totalMinutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // String used for displaying the time it takes to complete the train journey in localized format
    const travelTime = hours > 0
        ? `${hours} ${translation('shortHour')} ${minutes} ${translation('shortMin')}`
        : `${minutes} ${translation('shortMin')}`;

    return ({
        timeStamp,
        liveTimeStamp,
        totalMinutes,
        timeStampFinalDestination,
        travelTime
    })
}

const getLiveEstimateTimestamp = (liveDateTime: number | undefined, dateTime: number, locale: Locale) => {
    let liveTimeStamp: string | undefined = undefined;

    const currentLocaleFull = localeMap[locale] || 'fi-FI'; // Convert to full timestamp
    const formatter = new Intl.DateTimeFormat(currentLocaleFull, {
        hour: 'numeric',
        minute: 'numeric',
    });

    if (liveDateTime) {
        const oneMinuteInMillis = 60 * 1000; // Number of milliseconds in one minute

        if (dateTime < liveDateTime && (liveDateTime - dateTime > oneMinuteInMillis)) {
            liveTimeStamp = formatter.format(liveDateTime);
        }
    }
    return liveTimeStamp;
}

/**
 * Provides a localized timestamp with the use of Intl date and time formatting.
 *
 * @param {number} time A timestamp in milliseconds.
 * @param {Locale} locale Locale in en | se | fi format.
 * @returns {string} Localized timestamp.
 */
const getJourneyTimeStamp = (time: number, locale: Locale): string => {
    const currentLocaleFull = localeMap[locale] || 'fi-FI'; // Convert to full timestamp

    // Covert date object into a localized timestamp
    const formatter = new Intl.DateTimeFormat(currentLocaleFull, {
        hour: 'numeric',
        minute: 'numeric',
    });

    const timeStamp = formatter.format(time);
    return timeStamp;
};

type ExternalLinkProps = {
    href: string
    className?: string
    children: React.ReactNode

}

/**
 * Provides a Next.js link with legacy behavior that allows links to open in another browser tab. 
 */
const ExternalLink = ({ href, className, children }: ExternalLinkProps) => {
    return (
        <Link href={href} passHref legacyBehavior>
            <a className={`${className}`} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        </Link>
    );
};

type ColorIconProps = {
    currentScheduledTime: number
    nextScheduledTime: number | null
    cancelled: boolean
}

/**
 * Component that returns a styled icon and applies a color to it based on a train's current and future scheduled time.
 *
 * @param {number} param.currentScheduledTime The scheduled time of the current journey in milliseconds.
 * @param {number} param.nextScheduledTime The scheduled time of the journey after the current journey in milliseconds.
 */
const ColorIcon = ({ currentScheduledTime, nextScheduledTime, cancelled }: ColorIconProps) => {
    const currentTime = useTimestampInterval();
    const isOnGoingTrain = nextScheduledTime && currentTime >= currentScheduledTime && currentTime < nextScheduledTime;
    const isPassedTrain = currentTime > currentScheduledTime;

    if (cancelled) {
        return <div className="rounded-full absolute w-3 h-3 bg-red-800"></div>;
    }

    if (isOnGoingTrain) {
        return (
            <Skeleton className="rounded-full absolute w-3 h-3 bg-yellow-500" />
        )
    }
    if (isPassedTrain) {
        return (
            <>
                <div className="rounded-full absolute w-3 h-3 bg-green-800" />
                <div className="w-1 bg-green-800 h-full"></div>
            </>
        )
    }
    // Return gray icon by default to signal a journey has not been started or completed
    return (
        <>
            <div className="rounded-full absolute w-3 h-3 bg-neutral-400" />
            <div className="w-1 bg-neutral-400 h-full"></div>
        </>
    )
};

type JourneyItemProps = {
    index: number
    timeTableRow: TimeTableRow[]
    journey: TimeTable
    locale: Locale
}

/**
 * Component that returns either a colored icon, a link with a timestamp or an arrow pointing right
 * depending on the index of the list of station arrival and departure items.
 *
 * @param {number} param.index Current index of the list of items
 * @param {Row<TimeTable>} param.timeTableRow An array of all possible journeys, used to compare the current timestamp with the next scheduled timestamp. 
 * @param {TimeTable} param.journey TimeTable object of the current index's journey.
 * @param {("en | se | fi")} param.locale Locale used to set timestamp localization.
 */

const JourneyItem = ({ index, timeTableRow, journey, locale }: JourneyItemProps) => {
    const nextJourney: any = timeTableRow[index + 1];
    const dateTime = new Date(journey.scheduledTime).getTime();
    const cancelled = journey.cancelled;
    const liveEstimateTime = journey.liveEstimateTime ? new Date(journey.liveEstimateTime).getTime() : undefined;
    const liveEstimateTimeStamp = getLiveEstimateTimestamp(liveEstimateTime, dateTime, locale)
    const nextScheduledTime = nextJourney ? new Date(nextJourney.liveEstimateTime ?? nextJourney.scheduledTime).getTime() : null;

    return (
        <React.Fragment key={`fragment-${index}`}>
            {index % 2 === 0 && (
                <>
                    <li key={`icon-${index}`} className="flex items-center relative justify-center px-4">
                        <ColorIcon currentScheduledTime={liveEstimateTime ?? dateTime} nextScheduledTime={nextScheduledTime} cancelled={cancelled} />
                    </li>
                    <li key={`station-${index}`} className="flex flex-col items-start justify-center">
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="text-blue-600 font-medium">{journey.stationName}</span>
                        </div>
                        {liveEstimateTimeStamp ?
                            <div className="flex flex-row gap-1 ">
                                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                                <span className="">{liveEstimateTimeStamp}</span>
                            </div>
                            :
                            <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
                        }
                    </li>
                    {index < timeTableRow.length - 1 && (
                        <li key={`arrow-${index}`} className="flex items-center justify-center">
                            <ArrowRightAltIcon style={{ color: 'grey', margin: '0 8px' }} />
                        </li>
                    )}
                </>
            )}
            {index % 2 !== 0 && (
                <>
                    <li key={`station-${index}`} className="flex flex-col items-start justify-center">
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="text-blue-600 font-medium">{journey.stationName}</span>
                        </div>
                        {liveEstimateTimeStamp ?
                            <div className="flex flex-row gap-1 ">
                                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                                <span className="">{liveEstimateTimeStamp}</span>
                            </div>
                            :
                            <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
                        }
                    </li>
                </>
            )}
        </React.Fragment>
    );
};



export const createColumns = ({ tableType, locale, translation, selectedTrainNumber, setTrainNumber, sidebarRef }: CreateColumnsProps): ColumnDef<TimeTable>[] => {
    const handleButtonClick = (trainNumber: number) => {
        setTrainNumber(trainNumber);
        if (sidebarRef.current) {
            sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

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
                const { trainType, trainNumber, liveEstimateTime, scheduledTime, cancelled } = row.original;
                const iconColor = selectedTrainNumber === trainNumber ? '#3e64ed' : '#646770'
                const liveDateTime = liveEstimateTime ? new Date(liveEstimateTime).getTime() : new Date(scheduledTime).getTime();
                const isButtonDisabled = liveDateTime < Date.now() || cancelled;

                return <div className="flex flex-col items-center justify-center">
                    <Button disabled={isButtonDisabled} variant={'ghost'} onClick={() => handleButtonClick(trainNumber)}>
                        <PlaceIcon style={{ fill: iconColor }}></PlaceIcon>
                    </Button>
                    <span>{`${trainType} ${trainNumber}`}</span>
                </div>
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
                if (!tableType) return null;
                const tableTypeFormatted = tableType.toLowerCase();

                return (
                    <span>
                        {tableTypeFormatted === 'arrival' ?
                            translation(`origin`) :
                            translation(`destination`)
                        }
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
                const { liveEstimateTime } = row.original;
                const { unknownDelay } = row.original;
                const { cancelled } = row.original;
                const cancelledStyle = cancelled ? "text-red-700 line-through" : "";
                const cancelledTimeStyle = cancelled ? "text-red-700 line-through" : "text-gray-500"

                if (!scheduledFinalDestination) return null; // Exit early to avoid errors with converting undefined timestamps
                if (!tableType) return null;

                const { timeStamp, liveTimeStamp, totalMinutes, timeStampFinalDestination, travelTime } = getTimeStamp(scheduledTime, liveEstimateTime, scheduledFinalDestination, locale, translation)

                return (
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-end items-center lowercase">
                            {cancelled ?
                                <span className="capitalize font-bold">
                                    {translation("cancelled")}
                                </span>
                                : null}
                            <div className={`flex flex-row items-center ${cancelledStyle}`}>
                                {liveTimeStamp || unknownDelay ?
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <span className="font-medium line-through text-red-700">
                                            {timeStamp}
                                        </span>
                                        <span className="font-bold">
                                            {unknownDelay && !liveTimeStamp ? "?" : liveTimeStamp}
                                        </span>
                                    </div>
                                    :
                                    <span className="font-bold">
                                        {timeStamp}
                                    </span>
                                }
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
                                <span className={`${cancelledTimeStyle}`}>
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



export function TimeTableComponent({ data, destinationType }: TimeTableProps) {
    const { selectedTrainNumber, setTrainNumber, sidebarRef } = React.useContext(SelectedTrainContext);
    const t = useTranslations();
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'scheduledTime', desc: false }]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const tTimeTable = useTranslations('TimeTable');
    const locale = useLocale() as Locale;
    const columns = createColumns({
        tableType: destinationType,
        locale: locale,
        translation: tTimeTable,
        selectedTrainNumber: selectedTrainNumber,
        setTrainNumber: setTrainNumber,
        sidebarRef: sidebarRef
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
    })

    // Sets page number to where the currently selected train is
    React.useEffect(() => {
        // Use sorted rows to find the index
        const sortedRows = table.getSortedRowModel().rows;
        const rowIndex = sortedRows.findIndex(row => row.original.trainNumber === selectedTrainNumber);

        if (rowIndex !== -1) {
            const pageIndex = Math.floor(rowIndex / table.getState().pagination.pageSize);
            table.setPageIndex(pageIndex);
        }
    }, [selectedTrainNumber, table]);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center">
                <Input
                    placeholder={t("TimeTable.placeholder")}
                    value={(table.getColumn("stationName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("stationName")?.setFilterValue(event.target.value)
                    }
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
                                        <TableHead key={header.id} className="py-2">
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
                    <TableBody className="bg-white border">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        className="border-none hover:bg-inherit"
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="pt-8 h-28"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow className="hover:bg-inherit">
                                        <TableCell className="p-0" colSpan={row.getVisibleCells().length}>
                                            <AccordionItem className="border-none" value={row.id}>
                                                <AccordionTrigger className="flex-row justify-center gap-2 items-center p-3"></AccordionTrigger>
                                                <AccordionContent className="flex flex-col items-center justify-center">
                                                    <ol className="grid grid-cols-[min-content_min-content_1fr_min-content]">
                                                        {row.original.trainJourney.map((journey, index) => {
                                                            return (
                                                                <JourneyItem
                                                                    key={index}
                                                                    index={index}
                                                                    timeTableRow={(row.original.trainJourney) as TimeTableRow[]}
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
                                    {t('Navigation.searchnotfound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-start justify-end space-x-2 py-4 ">
                    <div className="flex flex-wrap items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <FirstPageIcon fontSize="small"></FirstPageIcon>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <KeyboardArrowLeftIcon fontSize="small"></KeyboardArrowLeftIcon>
                        </Button>
                        <div className="flex-1 text-sm text-muted-foreground">
                            <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount() === 0 ? 1 : table.getPageCount()}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <KeyboardArrowRightIcon fontSize="small"></KeyboardArrowRightIcon>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <LastPageIcon fontSize="small"></LastPageIcon>
                        </Button>
                    </div>
                </div>
            </Accordion>
        </div>
    )
}
