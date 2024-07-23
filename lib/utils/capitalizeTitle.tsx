/**
 * Utility function that capitalizes a city name while taking into consideration spaces, hyphens, underscores and brackets.
 *
 * @export
 * @param {string} cityLabel City name in a decoded plain text format.
 * @returns {string} A capitalized city name.
 */
export default function capitalizeTitle(cityLabel: string): string {
    if (!cityLabel) {
        throw new Error(`City name not defined: ${cityLabel}`);
    }
    // Split by spaces, hyphens, underscores, and brackets
    return cityLabel
        .split(/([-_\s()\[\]{}])/g) // Match and capture delimiters (spaces, hyphens, brackets)
        .map((part, index, array) => {
            // If part is a delimiter, return it directly
            if (part.match(/[-_\s()\[\]{}]/)) {
                return part;
            }

            // If the previous part was an opening bracket, capitalize the first letter
            if (index > 0 && array[index - 1].match(/[(\[{]/)) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }

            // Capitalize the first letter of other words
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join(''); // Join all parts back together without altering delimiters
}