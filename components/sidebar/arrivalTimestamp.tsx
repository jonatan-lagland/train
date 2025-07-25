"use client";
import { useTranslations } from "next-intl";
import { SiteLocale, TransformedTimeTableRow, TrainTypeParam } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatedEllipses } from "../ui/spinner";

type ArrivalTimestampProps = {
  stationNextTrainType: string;
  stationNextTrainNumber: number;
  city: string;
  destinationType: TrainTypeParam;
  locale: SiteLocale;
  stationNextTimestamp: string;
  stationNextTrainTrack?: string;
  timeStampNow: number;
  data: TransformedTimeTableRow[];
  commuterLink: string | undefined;
};

/**
 * Returns a localized banner that displays the station name, train number and a timestamp until the train's arrival.
 *
 * @param {ArrivalTimestampProps} props - The props object.
 * @param {string} props.city - City label.
 * @param {TrainTypeParam} props.destinationType - Whether the train is an arrival or destination train.
 * @param {string} props.stationNextTimestamp - Unix Timestamp of the next train arrival.
 * @param {number} props.stationNextTrainTrack - The train track of the next arriving train.
 * @param {TransformedTimeTableRow[]} props.data - Live train data, the length of which is evaluated.
  @param {TransformedTimeTableRow[]} props.commuterLink - Link to the station's commuter page, which is presented optionally if no journeys are found.
 */
export default function ArrivalTimestamp({
  city,
  destinationType,
  locale,
  stationNextTimestamp,
  stationNextTrainTrack,
  timeStampNow,
  data,
  commuterLink,
  stationNextTrainType,
  stationNextTrainNumber,
}: ArrivalTimestampProps): React.ReactElement {
  const translation = useTranslations("TimeTable");
  const decodedCity = decodeURIComponent(city);

  const calculateLocalizedLabel = useCallback(() => {
    const timeDifference = new Date(stationNextTimestamp).getTime() - timeStampNow;
    const totalMinutes = Math.max(Math.ceil(timeDifference / 60000), 0);

    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const travelTimeLabel =
      days > 0
        ? `${days} ${translation("longDay")} ${hours} ${translation("longHour")} ${minutes} ${translation("longMin")}`
        : hours > 0
        ? `${hours} ${translation("longHour")} ${minutes} ${translation("longMin")}`
        : `${minutes} ${translation("longMin")}`;

    /* Due to a difference in word order, each localization has to be handled seperately */
    switch (locale) {
      case "se":
        return (
          <span aria-live="polite" aria-atomic="true">
            {destinationType.toLowerCase() === "arrival" ? "Anländer till" : "Avgår från"} <span className="capitalize">{decodedCity}</span> station
            om <span className="font-bold">{travelTimeLabel}</span>
            {destinationType.toLowerCase() === "arrival" ? "på spår " : " från spår "}
            <span>{stationNextTrainTrack}</span>.
          </span>
        );
      case "en":
        return (
          <span aria-live="polite" aria-atomic="true">
            {destinationType.toLowerCase() === "arrival" ? "Arrives at " : "Departs from "} <span className="capitalize">{decodedCity}</span> station
            in <span className="font-bold">{travelTimeLabel}</span>
            {stationNextTrainTrack ? (
              <>
                {destinationType.toLowerCase() === "arrival" ? "on track " : " from track "}
                <span>{stationNextTrainTrack}</span>
              </>
            ) : null}
            {"."}
          </span>
        );
      default:
        return (
          <span aria-live="polite" aria-atomic="true">
            {destinationType.toLowerCase() === "arrival" ? "Saapuu " : "Lähtee "} <span className="capitalize">{decodedCity}</span>{" "}
            {destinationType.toLowerCase() === "arrival" ? "asemalle " : "asemalta "} <span className="font-bold">{travelTimeLabel}</span> kuluttua
            {stationNextTrainTrack ? (
              <>
                {destinationType.toLowerCase() === "arrival" ? " raiteelle " : " raiteelta "}
                <span>{stationNextTrainTrack}</span>
              </>
            ) : null}
            {"."}
          </span>
        );
    }
  }, [stationNextTimestamp, timeStampNow, translation, locale, destinationType, decodedCity, stationNextTrainTrack]);

  /* Default JSX element is a loading animation */
  const [localizedLabel, setLocalizedLabel] = useState<React.JSX.Element>(
    <div className="flex items-center justify-center h-16">
      <AnimatedEllipses></AnimatedEllipses>
    </div>
  );

  /*  useEffect hack is used here because in some cases the timestamp rendered during hydration
      would change as a minute passes, causing hydration errors
  */

  useEffect(() => {
    const localizedLabel = calculateLocalizedLabel();
    setLocalizedLabel(localizedLabel);
  }, [calculateLocalizedLabel]);

  return (
    <span className="font-medium text-slate-600">
      {data.length === 0 ? (
        <div className="flex flex-col gap-2">
          <span>{translation("noJourneyFound")}</span>
          {/* Render a link to the commuter page in cases where the link has been provided */}
          {commuterLink ? (
            <Link className="flex flex-row items-end gap-1 underline text-blue-600" href={commuterLink}>
              {translation("commuteSuggestion")}
            </Link>
          ) : null}
        </div>
      ) : (
        <>{localizedLabel}</>
      )}
    </span>
  );
}
