import { Train } from "@/lib/types";

const fetchAmount: number = 10;

async function fetchLiveTrain(station: string): Promise<Train[]> {
    try {
        const response = await fetch(`https://rata.digitraffic.fi/api/v1/live-trains/station/${station}?arrived_trains=${fetchAmount}&arriving_trains=${fetchAmount}&departed_trains=0&departing_trains=0&include_nonstopping=false`);
        const data: Train[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching live train data:', error);
        return [];
    }
}

export default fetchLiveTrain;
