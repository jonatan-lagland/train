/**
 * Generates a hyperlink URL for commuter trains on any given station. If the station is already on the commuter page,
 * returns undefined as no hyperlink is needed. The hyperlink will be displayed on pages where there are no on-going
 * or future train journeys.
 *
 * **Example:** *"There are currently no scheduled journeys. Search for commuter train instead."*
 *
 * @export
 * @param {string} pathname Current active URL pathname
 * @param {(string | null)} type Current active URL search param of "type", with a value of either *departure* or *arrival*
 * @param {(string | null)} destination Current *optional* active URL search param of "destination", with a value of a destination station's name
 * @param {(string | null)} commuter Current active URL search param of "commuter", with a value of either *true* or *false*. **NOTE: URL search params are of type string instead of boolean**
 * @returns {(string | undefined)} Reconstructed URL with the commuter option included, or undefined
 */
export default function useCommuterLink(
  pathname: string,
  type: string | null,
  destination: string | null,
  commuter: string | null
): string | undefined {
  if (commuter === "true" || null) return undefined;

  const str_type = type ? type : "arrival";
  const str_dest = destination ? `&destination=${destination}` : "";
  return `${pathname}?type=${str_type}${str_dest}&commuter=true`;
}
