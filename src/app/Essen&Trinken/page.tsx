import { draftMode } from "next/headers";
import { drinksQuery, foodQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { Drink, Food } from "@/types/sanityTypes";
import Menu from "../_components/Food&Drinks_Components/Menu";
import PreviewEssenUndTrinkenPage from "../_components/Food&Drinks_Components/PreviewEssenUndTrinkenPage";
import EssenUndTrinkenPage from "../_components/Food&Drinks_Components/EssenUndTrinkenPage";

export default async function EssenUndTrinken() {
  const foods = await sanityFetch<Food[]>({ query: foodQuery });
  const drinks = await sanityFetch<Drink[]>({ query: drinksQuery });

  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode) {
    return <PreviewEssenUndTrinkenPage food={foods} drinks={drinks} />;
  }

  return <EssenUndTrinkenPage food={foods} drinks={drinks} />;
}
