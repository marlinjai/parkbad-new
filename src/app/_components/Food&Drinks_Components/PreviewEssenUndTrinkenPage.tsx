"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import { drinksQuery, foodQuery } from "@/sanity/lib/sanity.queries";
import { Drink, Food } from "@/types/sanityTypes";
import Menu from "./Menu";
import EssenTrinkenPage from "./EssenUndTrinkenPage";

export default function PreviewEssenUndTrinkenPage({
  food = [],
  drinks = [],
}: {
  food: Food[];
  drinks: Drink[];
}) {
  const [foodData] = useLiveQuery(food, foodQuery);
  const [drinksData] = useLiveQuery(drinks, drinksQuery);

  return <EssenTrinkenPage food={foodData} drinks={drinksData} />;
}
