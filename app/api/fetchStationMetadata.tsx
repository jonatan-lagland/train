import { StationMetaData } from "@/lib/types";
import { headers, revalidateDuration } from "@/lib/utils";

async function fetchStationMetadata(): Promise<StationMetaData[]> {
  try {
    const response = await fetch(`https://rata.digitraffic.fi/api/v1/metadata/stations`, {
      headers,
      next: { revalidate: revalidateDuration },
    });
    const data: StationMetaData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching station metadata:", error);
    return [];
  }
}

export default fetchStationMetadata;
