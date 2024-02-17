"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import {
  drinkCategoriesQuery,
  foodCategoriesQuery,
  foodQuery,
} from "../../../sanity/lib/sanity.queries";
import { DrinkCategory, Food, FoodCategory } from "@/types/sanityTypes";

import EssenTrinkenPage from "./EssenUndTrinkenPage";

export default function PreviewEssenUndTrinkenPage({
  food = [],
  drinksCategories = [],
  foodCategories = [],
}: {
  food: Food[];
  drinksCategories: DrinkCategory[];
  foodCategories: FoodCategory[];
}) {
  const [foodData] = useLiveQuery(food, foodQuery);
  const [foodCategoriesData] = useLiveQuery(
    foodCategories,
    foodCategoriesQuery
  );

  const [drinksCategoriesData] = useLiveQuery(
    drinksCategories,
    drinkCategoriesQuery
  );

  return (
    <EssenTrinkenPage
      food={foodData}
      foodCategories={foodCategoriesData}
      drinksCategories={drinksCategoriesData}
    />
  );
}
