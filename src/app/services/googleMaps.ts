// services/googleMaps.ts
"use server";

import { OpeningHour } from "@/types/componentTypes";
import axios from "axios";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

async function fetchOpeningHours(businessName: string): Promise<OpeningHour[]> {
  try {
    const searchURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      businessName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

    const searchResponse = await fetch(searchURL);
    const searchData = await searchResponse.json();

    console.log("Search Data:", searchData); // Debugging

    const placeId = searchData.candidates?.[0]?.place_id;
    if (!placeId) {
      console.error("Business not found for:", businessName); // Debugging
      throw new Error("Business not found");
    }

    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;
    const detailsResponse = await axios.get(detailsURL);
    const detailsData = detailsResponse.data;

    console.log("Details Data:", detailsData); // Debugging

    let weekday_text = detailsData.result.opening_hours?.weekday_text;
    let openingHours = weekday_text
      ? weekday_text.map((day: string) => {
          const dayParts = day.split(": ");
          return { dayName: dayParts[0], hours: dayParts[1] };
        })
      : [];

    if (!openingHours) {
      console.log("No opening hours available for:", businessName); // Debugging
      openingHours = [];
    }

    return openingHours;
  } catch (error) {
    console.error("Error fetching opening hours for", businessName, ":", error);
    throw error;
  }
}

export default fetchOpeningHours;
