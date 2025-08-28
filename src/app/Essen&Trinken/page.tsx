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
    revalidate: 3600 // 1 hour (menu changes less frequently)
  });
  const drinkcategories = await sanityFetch<DrinkCategory[]>({
    query: drinkCategoriesQuery,
    tags: ['drinkCategories'],
    revalidate: 7200 // 2 hours (categories change rarely)
  });
  const foodCategories = await sanityFetch<FoodCategory[]>({
    query: foodCategoriesQuery,
    tags: ['foodCategories'],
    revalidate: 7200 // 2 hours (categories change rarely)
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
