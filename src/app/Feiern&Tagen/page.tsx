import React from "react";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import CelebratingHero from "../_components/GeneralComponents/CelebratingHero";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { Gallery } from "@/types/sanityTypes";
import { celebrationFaderQuery } from "@/sanity/lib/sanity.queries";

export default async function FeiernUndTagen() {
  const heroImagesArray = await sanityFetch<Gallery[]>({
    query: celebrationFaderQuery,
  });

  return (
    <SiteLayout>
      <CelebratingHero heroImages={heroImagesArray}></CelebratingHero>
    </SiteLayout>
  );
}
