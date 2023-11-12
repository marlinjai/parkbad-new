"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import { drinksQuery, foodQuery } from "@/sanity/lib/sanity.queries";
import { Drink, Food } from "@/types/sanityTypes";
import Menu from "./Food&Drinks_Components/Menu";

export default function PreviewHomePage({
  food = [],
  drinks = [],
}: {
  food: Food[];
  drinks: Drink[];
}) {
  const [foodData] = useLiveQuery(food, foodQuery);
  const [drinksData] = useLiveQuery(drinks, drinksQuery);

  return <Menu foods={foodData} drinks={drinksData} />;
}
