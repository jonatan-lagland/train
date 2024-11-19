import React from "react";
import ColorIcon from "./colorIcon";
import { getJourneyTimeStamp, getLiveEstimateTimestamp, LocaleNextIntl } from "@/lib/utils/timeStampUtils";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { TimeTableRow, TransformedTimeTableRow } from "@/lib/types";

type JourneyItemProps = {
  index: number;
  timeTableRow: TimeTableRow[];
  journey: TransformedTimeTableRow;
  locale: LocaleNextIntl;
};

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
  const liveEstimateTimeStamp = getLiveEstimateTimestamp(liveEstimateTime, dateTime, locale);
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
            {liveEstimateTimeStamp ? (
              <div className="flex flex-row gap-1 ">
                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                <span className="">{liveEstimateTimeStamp}</span>
              </div>
            ) : (
              <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
            )}
          </li>
          {index < timeTableRow.length - 1 && (
            <li key={`arrow-${index}`} className="flex items-center justify-center">
              <ArrowRightAltIcon style={{ color: "grey", margin: "0 8px" }} />
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
            {liveEstimateTimeStamp ? (
              <div className="flex flex-row gap-1 ">
                <span className="line-through text-red-700">{getJourneyTimeStamp(dateTime, locale)}</span>
                <span className="">{liveEstimateTimeStamp}</span>
              </div>
            ) : (
              <span className="">{getJourneyTimeStamp(dateTime, locale)}</span>
            )}
          </li>
        </>
      )}
    </React.Fragment>
  );
};

export default JourneyItem;
