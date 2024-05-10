export default function useCapitalizeTitle(str: string) {
    // Split by spaces, hyphens, underscores, and brackets
    return str
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