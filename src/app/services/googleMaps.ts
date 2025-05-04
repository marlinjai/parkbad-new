// services/googleMaps.ts
"use server";

import { OpeningHour } from "@/types/componentTypes";

async function fetchOpeningHours(): Promise<OpeningHour[]> {
  try {
    // Use absolute URL for server components
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    // Use the cached API endpoint instead of direct Google API calls
    const response = await fetch(`${baseUrl}/api/openingHours`, {
      next: { revalidate: 86400 } // Revalidate once per day
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.openingHours || [];
    
  } catch (error) {
    console.error("Error fetching opening hours:", error);
    return []; // Return empty array on error
  }
}

export default fetchOpeningHours;
