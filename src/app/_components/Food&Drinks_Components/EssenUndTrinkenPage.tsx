import { DrinkCategory, Food } from "@/types/sanityTypes";
import SiteLayout from "../UtilityComponents/SiteLayout";
import Menu from "./Menu";

export interface FoodAndDrinksPageProps {
  preview?: boolean;
  loading?: boolean;
  food: Food[];
  drinksCategories: DrinkCategory[];
}

export default function EssenTrinkenPage(props: FoodAndDrinksPageProps) {
  const { preview, food, drinksCategories } = props;

  return (
    <>
      <SiteLayout preview={preview}>
        <Menu food={food} drinksCategories={drinksCategories}></Menu>
      </SiteLayout>
    </>
  );
}
