import { NextResponse } from "next/server";

// Enable ISR - Revalidate at most once per day
export const revalidate = 86400; // Cache for 24 hours (in seconds)

export async function GET() {
  const businessName = "Parkbad Gütersloh"; // Hardcoded since this is always the same
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // Get Place ID first
    const searchURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      businessName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

    // Don't specify cache option here, let Next.js handle caching with revalidate
    const searchResponse = await fetch(searchURL);
    const searchData = await searchResponse.json();
    
    console.log("Search Data (cached):", searchData);

    const placeId = searchData.candidates?.[0]?.place_id;

    if (!placeId) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 400 }
      );
    }

    // Use Place ID to get opening hours
    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

    // Don't specify cache option here, let Next.js handle caching with revalidate
    const detailsResponse = await fetch(detailsURL);
    const detailsData = await detailsResponse.json();
    
    console.log("Details Data (cached):", detailsData);

    let weekday_text = detailsData.result.opening_hours?.weekday_text;
    let openingHours = weekday_text
      ? weekday_text.map((day: string) => {
          const dayParts = day.split(": ");
          return { dayName: dayParts[0], hours: dayParts[1] };
        })
      : [];

    // Include last updated timestamp for debugging
    return NextResponse.json({ 
      openingHours, 
      lastUpdated: new Date().toISOString() 
    });
  } catch (error) {
    console.error("Error encountered:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Google Maps API" },
      { status: 500 }
    );
  }
} 