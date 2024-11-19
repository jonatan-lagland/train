"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useTimestampInterval from "@/lib/utils/timestampInterval";

type ColorIconProps = {
  currentScheduledTime: number;
  nextScheduledTime: number | null;
  cancelled: boolean;
};

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
    return <Skeleton className="rounded-full absolute w-3 h-3 bg-yellow-500" />;
  }
  if (isPassedTrain) {
    return (
      <>
        <div className="rounded-full absolute w-3 h-3 bg-green-800" />
        <div className="w-1 bg-green-800 h-full"></div>
      </>
    );
  }
  // Return gray icon by default to signal a journey has not been started or completed
  return (
    <>
      <div className="rounded-full absolute w-3 h-3 bg-neutral-400" />
      <div className="w-1 bg-neutral-400 h-full"></div>
    </>
  );
};

export default ColorIcon;
