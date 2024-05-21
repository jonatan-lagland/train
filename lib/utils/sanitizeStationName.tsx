/**
 * A function that takes in a station name and removes the word "asema" and underscores from it.

 * @param {string} stationName - A string containing the station name.
 * @returns {string} A modified version of the station name string.
 */

export default function sanitizeStationName(stationName: string): string {
    return stationName
        .replace(/(^|\s)asema\b/gi, "") // Remove "asema" when preceded by a space or at the start
        .replace(/_/g, " ") // Replace underscores with spaces
        .trim() // Remove leading/trailing spaces
}