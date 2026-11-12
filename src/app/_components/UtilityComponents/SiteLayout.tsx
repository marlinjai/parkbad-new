"use client";
import fetchOpeningHours from "@/app/services/googleMaps";
import { OpeningHour } from "@/types/componentTypes";
import React, { useEffect, useState } from "react";
import Footer from "../Footer_Components/Footer";
import { Header } from "../Header_Components/Header";
import AlertBanner from "./AlertBanner";
import Loading from "./LoadingSpinner";

export default function SiteLayout({
  children,
  preview,
  skipLoading = false,
}: {
  children: React.ReactNode;
  preview?: boolean;
  // Render the page at once, without the intro spinner. The 404 page uses it:
  // its message and links must be in the server HTML, also when JavaScript
  // does not run, and a visitor who mistyped a link should not wait 2.7 s.
  skipLoading?: boolean;
}) {
  const [loading, setLoading] = useState(!skipLoading);

  // Use the OpeningHour[] type for your state
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    if (skipLoading) return;
    // `loading` starts as true; show the spinner for a fixed period on mount.
    // Simulate a loading period (you can adjust the timeout as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2700);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [skipLoading]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching opening hours data...");
      try {
        const response = await fetchOpeningHours();
        console.log("Opening hours fetched successfully:", response.length > 0 ? "Data found" : "No data");
        setOpeningHours(response);
      } catch (error) {
        console.error("Error fetching opening hours:", error);
        // Still set empty array to prevent footer from crashing
        setOpeningHours([]);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // console.log("openingHours:", openingHours);
  }, [openingHours]); // This effect runs whenever openingHours changes

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <Header />
          <AlertBanner preview={preview} />
          <main className="flex flex-col w-screen">
            {children}
          </main>
          <Footer openingHours={openingHours} />
        </>
      )}
    </>
  );
}
