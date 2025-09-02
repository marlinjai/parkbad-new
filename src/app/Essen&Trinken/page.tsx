import { draftMode } from "next/headers";
import {
  drinkCategoriesQuery,
  foodCategoriesQuery,
  foodQuery,
} from "@/sanity/lib/sanity.queries";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { DrinkCategory, Food, FoodCategory } from "@/types/sanityTypes";
import PreviewEssenUndTrinkenPage from "../_components/Food&Drinks_Components/PreviewEssenUndTrinkenPage";
import EssenUndTrinkenPage from "../_components/Food&Drinks_Components/EssenUndTrinkenPage";

export default async function EssenUndTrinken() {
  const foods = await sanityFetch<Food[]>({ 
    query: foodQuery,
    tags: ['food'],
    revalidate: false // Rely on webhook-based revalidation only
  });
  const drinkcategories = await sanityFetch<DrinkCategory[]>({
    query: drinkCategoriesQuery,
    tags: ['drinkCategories'],
    revalidate: false // Rely on webhook-based revalidation only
  });
  const foodCategories = await sanityFetch<FoodCategory[]>({
    query: foodCategoriesQuery,
    tags: ['foodCategories'],
    revalidate: false // Rely on webhook-based revalidation only
  });

  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  if (isDraftMode) {
    return (
      <PreviewEssenUndTrinkenPage
        food={foods}
        foodCategories={foodCategories}
        drinksCategories={drinkcategories}
      />
    );
  }

  return (
    <EssenUndTrinkenPage
      food={foods}
      foodCategories={foodCategories}
      drinksCategories={drinkcategories}
    />
  );
}
