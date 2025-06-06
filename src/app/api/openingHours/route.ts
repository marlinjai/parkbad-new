import { NextResponse } from "next/server";

// Enable ISR - Revalidate at most once per day
export const revalidate = 86400; // Cache for 24 hours (in seconds)

export async function GET() {
  const businessName = "Parkbad Gütersloh"; // Hardcoded since this is always the same
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Validate API key is present
  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY environment variable is not set");
    return NextResponse.json(
      { 
        error: "API key not configured",
        environment: process.env.NODE_ENV || 'unknown',
        lastUpdated: new Date().toISOString(),
        // Return mock data in production to prevent display issues
        openingHours: process.env.NODE_ENV === 'production' ? [
          { dayName: 'Monday', hours: '15:00 – 22:00' },
          { dayName: 'Tuesday', hours: '15:00 – 22:00' },
          { dayName: 'Wednesday', hours: '15:00 – 22:00' },
          { dayName: 'Thursday', hours: '15:00 – 22:00' },
          { dayName: 'Friday', hours: '15:00 – 22:00' },
          { dayName: 'Saturday', hours: '12:00 – 22:00' },
        ] : []
      },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching data for business: ${businessName} (ENV: ${process.env.NODE_ENV})`);
    
    // Get Place ID first
    const searchURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      businessName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

    console.log("Making request to Google API (Find Place)");
    // Don't specify cache option here, let Next.js handle caching with revalidate
    const searchResponse = await fetch(searchURL);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`Google Places API search error: ${searchResponse.status}, Response: ${errorText}`);
      throw new Error(`Google API responded with status: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    console.log("Search Data:", JSON.stringify(searchData));

    const placeId = searchData.candidates?.[0]?.place_id;

    if (!placeId) {
      console.error("Place ID not found in Google API response:", searchData);
      return NextResponse.json(
        { 
          error: "Business not found",
          rawResponse: searchData,
          lastUpdated: new Date().toISOString() 
        },
        { status: 400 }
      );
    }

    // Use Place ID to get opening hours
    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

    console.log("Making request to Google API (Place Details)");
    // Don't specify cache option here, let Next.js handle caching with revalidate
    const detailsResponse = await fetch(detailsURL);
    
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error(`Google Places API details error: ${detailsResponse.status}, Response: ${errorText}`);
      throw new Error(`Google API responded with status: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    console.log("Details Data:", JSON.stringify(detailsData));

    if (!detailsData.result?.opening_hours?.weekday_text) {
      console.warn("No opening hours found in Google API response:", detailsData);
      
      // Return mock data in production to prevent display issues
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ 
          openingHours: [
            { dayName: 'Monday', hours: '15:00 – 22:00' },
            { dayName: 'Tuesday', hours: '15:00 – 22:00' },
            { dayName: 'Wednesday', hours: '15:00 – 22:00' },
            { dayName: 'Thursday', hours: '15:00 – 22:00' },
            { dayName: 'Friday', hours: '15:00 – 23:00' },
            { dayName: 'Saturday', hours: '15:00 – 23:00' },
            { dayName: 'Sunday', hours: '14:00 – 22:00' }
          ],
          usingMockData: true,
          lastUpdated: new Date().toISOString() 
        });
      }
    }

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
    
    // Return mock data in production to prevent display issues
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ 
        error: "Failed to fetch data from Google Maps API",
        errorDetails: error instanceof Error ? error.message : String(error),
        openingHours: [
          { dayName: 'Monday', hours: '15:00 – 22:00' },
          { dayName: 'Tuesday', hours: '15:00 – 22:00' },
          { dayName: 'Wednesday', hours: '15:00 – 22:00' },
          { dayName: 'Thursday', hours: '15:00 – 22:00' },
          { dayName: 'Friday', hours: '15:00 – 23:00' },
          { dayName: 'Saturday', hours: '15:00 – 23:00' },
          { dayName: 'Sunday', hours: '14:00 – 22:00' }
        ],
        usingMockData: true,
        lastUpdated: new Date().toISOString() 
      });
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch data from Google Maps API",
        errorDetails: error instanceof Error ? error.message : String(error),
        lastUpdated: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
} 