import { draftMode } from "next/headers";
import { drinksQuery, foodQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { Drink, Food } from "@/types/sanityTypes";
import Menu from "../_components/Food&Drinks_Components/Menu";
import PreviewMenu from "../_components/PreviewMenu";

export default async function EssenUndTrinkenPage() {
  const foods = await sanityFetch<Food[]>({ query: foodQuery });
  const drinks = await sanityFetch<Drink[]>({ query: drinksQuery });

  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode) {
    return <PreviewMenu foods={foods} drinks={drinks} />;
  }

  return <Menu foods={foods} drinks={drinks} />;
}
