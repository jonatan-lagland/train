import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const revalidateDuration: number = 60 * 60 * 24; // Revalidate once a day
export const headers = {
  "Digitraffic-User": "Suomilinja",
};