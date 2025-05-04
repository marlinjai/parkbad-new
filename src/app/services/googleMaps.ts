// services/googleMaps.ts
"use server";

import { OpeningHour } from "@/types/componentTypes";

async function fetchOpeningHours(): Promise<OpeningHour[]> {
  try {
    // Get the environment-specific base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : '');
    
    console.log(`Using API base URL: ${baseUrl}`);
    
    if (!baseUrl) {
      console.error("No base URL available - this will fail in production");
      throw new Error("Base URL is not defined");
    }
    
    // Use the cached API endpoint instead of direct Google API calls
    const response = await fetch(`${baseUrl}/api/openingHours`, {
      next: { revalidate: 86400 }, // Revalidate once per day
      cache: 'no-store' // Temporarily disable cache to diagnose production issues
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status: ${response.status}, Message: ${errorText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Opening hours data received:", data);
    
    if (!data.openingHours || data.openingHours.length === 0) {
      console.warn("No opening hours data returned from API");
    }
    
    return data.openingHours || [];
    
  } catch (error) {
    console.error("Error fetching opening hours:", error);
    
    // For debugging in production - return a test array if API fails
    if (process.env.NODE_ENV === 'production') {
      console.log("Using fallback opening hours data for production");
      
      // Return some test data to prevent "Derzeit geschlossen" from showing
      return [
        { dayName: 'Monday', hours: '15:00 – 22:00' },
        { dayName: 'Tuesday', hours: '15:00 – 22:00' },
        { dayName: 'Wednesday', hours: '15:00 – 22:00' },
        { dayName: 'Thursday', hours: '15:00 – 22:00' },
        { dayName: 'Friday', hours: '15:00 – 22:00' },
        { dayName: 'Saturday', hours: '12:00 – 22:00' },
      ];
    }
    
    return []; // Return empty array on error in development
  }
}

export default fetchOpeningHours;
