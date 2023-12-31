import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const businessName = url.searchParams.get("businessName");

  if (!businessName || typeof businessName !== "string") {
    return NextResponse.json(
      { error: "businessName is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // Get Place ID first using Fetch
    const searchURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      businessName
    )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

    const searchResponse = await fetch(searchURL);
    const searchResponseText = await searchResponse.text();
    const searchData = JSON.parse(searchResponseText);

    const placeId = searchData.candidates?.[0]?.place_id;

    if (!placeId) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 400 }
      );
    }

    // Use Place ID to get opening hours using Fetch
    // const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`
    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,name,formatted_address&key=${apiKey}`;

    const detailsResponse = await fetch(detailsURL);
    const detailsResponseText = await detailsResponse.text();
    const detailsData = JSON.parse(detailsResponseText);

    let openingHours = detailsData.result.opening_hours?.weekday_text;

    if (openingHours == undefined) {
      openingHours = [];
    }

    return NextResponse.json({ openingHours }, { status: 200 });
  } catch (error) {
    console.error("Error encountered:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Google Maps API" },
      { status: 500, statusText: "Failed to fetch data from Google Maps API" }
    );
  }
}
