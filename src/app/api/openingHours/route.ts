import { NextResponse } from "next/server";

// Temporarily disable caching to force fresh data after code changes
// export const revalidate = 86400; // Cache for 24 hours (in seconds)

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
        openingHours: [], // Return empty array to show "Derzeit geschlossen"
        status: 'api-key-missing'
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
    // Add cache tags for on-demand revalidation
    const searchResponse = await fetch(searchURL, {
      next: { tags: ['opening-hours'] }
    });
    
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
    // Add cache tags for on-demand revalidation
    const detailsResponse = await fetch(detailsURL, {
      next: { tags: ['opening-hours'] }
    });
    
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error(`Google Places API details error: ${detailsResponse.status}, Response: ${errorText}`);
      throw new Error(`Google API responded with status: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    console.log("Details Data:", JSON.stringify(detailsData));

    if (!detailsData.result?.opening_hours?.weekday_text) {
      console.log("No opening hours found in Google API response:", detailsData);
      
      // Return empty array to trigger "Derzeit geschlossen" display
      return NextResponse.json({ 
        openingHours: [],
        lastUpdated: new Date().toISOString(),
        cacheStrategy: '24h-with-manual-revalidation',
        source: 'google-places-api',
        status: 'closed-no-hours-available'
      });
    }

    let weekday_text = detailsData.result.opening_hours?.weekday_text;
    let openingHours = weekday_text
      ? weekday_text.map((day: string) => {
          const dayParts = day.split(": ");
          return { dayName: dayParts[0], hours: dayParts[1] };
        })
      : [];

    // Include metadata for debugging and change detection
    const response = {
      openingHours, 
      lastUpdated: new Date().toISOString(),
      cacheStrategy: '24h-with-manual-revalidation',
      source: 'google-places-api'
    };

    console.log('Opening hours updated:', JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error encountered:", error);
    
    // Return empty array to show "Derzeit geschlossen" when API fails
    return NextResponse.json({ 
      error: "Failed to fetch data from Google Maps API",
      errorDetails: error instanceof Error ? error.message : String(error),
      openingHours: [],
      lastUpdated: new Date().toISOString(),
      status: 'api-error'
    });
  }
} 