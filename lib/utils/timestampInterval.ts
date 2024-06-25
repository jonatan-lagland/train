'use client'
import { useEffect, useState } from "react";

/**
 * Hook that calculates the time until the next full minute and triggers a re-render at the start of each minute.
 *
 * @returns {number} A timestamp in Unix format.
 */
export default function useTimestampInterval(): number {
    const [timeStampNow, setTimeStampNow] = useState(Date.now());

    useEffect(() => {
        const now = new Date();
        const nextFullMinute = new Date(now);
        nextFullMinute.setMinutes(now.getMinutes() + 1, 0, 0);
        const timeUntilNextMinute = nextFullMinute.getTime() - now.getTime();

        const timeout = setTimeout(() => {
            setTimeStampNow(Date.now());

            const interval = setInterval(() => {
                setTimeStampNow(Date.now());
            }, 60000);

            return () => clearInterval(interval);
        }, timeUntilNextMinute);

        return () => clearTimeout(timeout);
    }, []);

    return timeStampNow;
}