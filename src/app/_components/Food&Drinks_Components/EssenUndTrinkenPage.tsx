import { DrinkCategory, Food, FoodCategory } from "@/types/sanityTypes";
import SiteLayout from "../UtilityComponents/SiteLayout";
import Menu from "./Menu";

export interface FoodAndDrinksPageProps {
  preview?: boolean;
  loading?: boolean;
  food: Food[];
  drinksCategories: DrinkCategory[];
  foodCategories: FoodCategory[];
}

export default function EssenTrinkenPage(props: FoodAndDrinksPageProps) {
  const { preview, food, drinksCategories, foodCategories } = props;

  return (
    <>
      <SiteLayout preview={preview}>
        <Menu
          food={food}
          foodCategories={foodCategories}
          drinksCategories={drinksCategories}
        ></Menu>
      </SiteLayout>
    </>
  );
}
