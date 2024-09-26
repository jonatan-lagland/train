import { StationMetaData } from "../types";

/**
 * A function that takes in station metadata and filters it to only include stations with passenger traffic.

 * @param {StationMetaData[]} stationMetadata - An array containing metadata about stations.
 * @returns {StationMetaData[]} A filtered version of station metadata.
 */

export default function filterStationMetadata(
  stationMetadata: StationMetaData[]
): StationMetaData[] {
  const filteredStations = stationMetadata
    ? stationMetadata.filter((station) => station.passengerTraffic === true)
    : [];
  return filteredStations;
}
