export type Locale = 'en | se | fi'

/* Workaround for useLocale not returning a full time format and causing issues with the swedish format. */
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
export function getTimeStamp(scheduledTime: string, liveEstimateTime: string | undefined, scheduledFinalDestination: string, locale: Locale, translation: any) {
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

/**
 * Compares a live train arrival time with a scheduled time and in the case of the time difference between the
 * live time and a scheduled time being more than one minute, returns a  a localized timestamp with the use of 
 * Intl date and time formatting. Otherwise, returns undefined.
 *
 * @param {(number | undefined)} liveDateTime Timestamp in milliseconds for a live estimated train arrival time
 * @param {number} dateTime Timestamp in milliseconds for a scheduled train arrival time
 * @param {Locale} locale Locale in en | se | fi format
 * @returns {string | undefined} A localized timestamp or undefined
 */
export const getLiveEstimateTimestamp = (liveDateTime: number | undefined, dateTime: number, locale: Locale): string | undefined => {
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
 * @param {number} dateTime Timestamp in milliseconds for a scheduled train arrival time
 * @param {Locale} locale Locale in en | se | fi format
 * @returns {string} Localized timestamp
 */
export const getJourneyTimeStamp = (dateTime: number, locale: Locale): string => {
    const currentLocaleFull = localeMap[locale] || 'fi-FI'; // Convert to full timestamp

    // Covert date object into a localized timestamp
    const formatter = new Intl.DateTimeFormat(currentLocaleFull, {
        hour: 'numeric',
        minute: 'numeric',
    });

    const timeStamp = formatter.format(dateTime);
    return timeStamp;
};