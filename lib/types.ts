export type Train = {
    trainNumber: number
    departureDate: string
    operatorUICCode: number
    operatorShortCode: string
    trainType: string
    trainCategory: string
    commuterLineID?: string
    runningCurrently: boolean
    cancelled: boolean
    version: number
    timetableType: "REGULAR" | "ADHOC"
    timetableAcceptanceDate: string
    deleted?: boolean
    timeTableRows:
    {
        trainStopping: boolean
        stationShortCode: string
        stationcUICCode: number
        countryCode: "FI" | "RU"
        type: "ARRIVAL" | "DEPARTURE"
        commercialStop?: boolean
        commercialTrack?: string
        cancelled: boolean
        scheduledTime: string
        liveEstimateTime?: string
        estimateSource?: string
        unknownDelay?: boolean
        actualTime: string
        differenceInMinutes: number
        causes:
        {
            categoryCodeId: 'A' | 'E' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'O' | 'P' | 'R' | 'S' | 'T' | 'V' | 'X',
            categoryCode: string
            detailedCategoryCodeId?: string
            detailedCategoryCode?: string
            thirdCategoryCodeId?: string
            thirdCategoryCode?: string
        }
        trainReady: {
            source: string
            accepted: string,
            timestamp: string
        }
    }
}