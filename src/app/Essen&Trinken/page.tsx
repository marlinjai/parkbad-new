import { draftMode } from "next/headers";
import { drinkCategoriesQuery, foodQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { DrinkCategory, Food } from "@/types/sanityTypes";
import PreviewEssenUndTrinkenPage from "../_components/Food&Drinks_Components/PreviewEssenUndTrinkenPage";
import EssenUndTrinkenPage from "../_components/Food&Drinks_Components/EssenUndTrinkenPage";

export default async function EssenUndTrinken() {
  const foods = await sanityFetch<Food[]>({ query: foodQuery });
  const drinkcategories = await sanityFetch<DrinkCategory[]>({
    query: drinkCategoriesQuery,
  });

  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode) {
    return (
      <PreviewEssenUndTrinkenPage
        food={foods}
        drinksCategories={drinkcategories}
      />
    );
  }

  return (
    <EssenUndTrinkenPage food={foods} drinksCategories={drinkcategories} />
  );
}
