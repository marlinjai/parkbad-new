// src/app/_components/Food&Drinks_Components/PreviewEssenUndTrinkenPage.tsx

"use client";

import { DrinkCategory, Food, FoodCategory } from "@/types/sanityTypes";
import EssenTrinkenPage from "./EssenUndTrinkenPage";

// Temporarily disabled preview functionality for Next.js 15 compatibility
export default function PreviewEssenUndTrinkenPage({
  food = [],
  drinksCategories = [],
  foodCategories = [],
}: {
  food: Food[];
  drinksCategories: DrinkCategory[];
  foodCategories: FoodCategory[];
}) {
  // TODO: Re-implement preview functionality when next-sanity preview is compatible
  return (
    <EssenTrinkenPage
      food={food}
      foodCategories={foodCategories}
      drinksCategories={drinksCategories}
    />
  );
}
