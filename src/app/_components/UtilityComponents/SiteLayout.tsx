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
}: {
  children: React.ReactNode;
  preview?: boolean;
}) {
  const [loading, setLoading] = useState(true);

  // Use the OpeningHour[] type for your state
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    // Start loading when pathname or searchParams change
    setLoading(true);

    // Simulate a loading period (you can adjust the timeout as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2700);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // React to changes in path or search parameters

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
          <main className="flex justify-center w-screen flex-col min-h-vh40 bg-brand-accent-2">
            {children}
          </main>
          <Footer openingHours={openingHours} />
        </>
      )}
    </>
  );
}
