"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AlertBanner from "./AlertBanner";
import { Header } from "../Header_Components/Header";
import Footer from "../Footer_Components/Footer";
import fetchOpeningHours from "@/app/services/googleMaps";
import { OpeningHour } from "@/types/componentTypes";
import Loading from "./LoadingSpinner";

export default function SiteLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [searchParams] = useSearchParams();

  // Use the OpeningHour[] type for your state
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    // Start loading when pathname or searchParams change
    setLoading(true);

    // Simulate a loading period (you can adjust the timeout as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [pathname, searchParams]); // React to changes in path or search parameters

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchOpeningHours("Parkbad Gütersloh");
      setOpeningHours(response);
    };

    fetchData();
  }, []);

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
