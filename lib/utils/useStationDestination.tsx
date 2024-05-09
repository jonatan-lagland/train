'use client'
import { StationMetaData } from '../types'
import { notFound } from 'next/navigation'

type useStationDestinationProps = {
    city: string
    stationMetadata: StationMetaData[]
}

// Normalize function to handle diacritical marks, spaces, and special characters
const normalizeString = (str: string) =>
    str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[\s\-\(\)]+/g, "") // Replace spaces, hyphens, and brackets with nothing (empty space)
        .toLowerCase(); // Convert to lowercase

// Sanitize function to remove/replace specific patterns (e.g., "asema" and underscores)
const sanitizeStationName = (stationName: string) =>
    stationName
        .replace(/(^|\s)asema\b/gi, "") // Remove "asema" when preceded by a space or at the start
        .replace(/_/g, " ") // Replace underscores with spaces
        .trim(); // Remove leading/trailing spaces

// Combine normalization and sanitization into one function for comparison
const normalizeAndSanitize = (name: string) => normalizeString(sanitizeStationName(name));


/**
 * A hook that searches for a station by its name based on the provided string and stations object.
 * If a station name isn't found in the metadata, the `notFound` function will be called.
 *
 * @param {string} city - A string containing the city name to search for.
 * @param {StationMetaData[]} stationMetadata - An array of objects representing station metadata.
 *
 * @returns {string} - The original, non-sanitized station name if found.
 */

function useStationDestination({ city, stationMetadata }: useStationDestinationProps): string {
    const normalizedAndSanitizedCity = normalizeAndSanitize(city);
    const matchedStation = stationMetadata.find(
        (station) => normalizeAndSanitize(station.stationName) === normalizedAndSanitizedCity
    );


    // If no station matches, trigger the 404 error page
    if (!matchedStation) {
        notFound();
    }



    // Return sanitized but non-normalized station name if found
    return sanitizeStationName(matchedStation!.stationName); // Non-null assertion since notFound handles missing
}

export default useStationDestination