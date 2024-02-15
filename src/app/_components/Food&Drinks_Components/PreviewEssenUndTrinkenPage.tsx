"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import {
  drinkCategoriesQuery,
  foodQuery,
} from "../../../sanity/lib/sanity.queries";
import { DrinkCategory, Food } from "@/types/sanityTypes";

import EssenTrinkenPage from "./EssenUndTrinkenPage";

export default function PreviewEssenUndTrinkenPage({
  food = [],
  drinksCategories = [],
}: {
  food: Food[];
  drinksCategories: DrinkCategory[];
}) {
  const [foodData] = useLiveQuery(food, foodQuery);
  const [drinksCategoriesData] = useLiveQuery(
    drinksCategories,
    drinkCategoriesQuery
  );

  return (
    <EssenTrinkenPage food={foodData} drinksCategories={drinksCategoriesData} />
  );
}
