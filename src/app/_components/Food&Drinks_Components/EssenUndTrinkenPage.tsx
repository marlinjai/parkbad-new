import { Drink, Food } from "@/types/sanityTypes";
import SiteLayout from "../UtilityComponents/SiteLayout";
import Menu from "./Menu";

export interface FoodAndDrinksPageProps {
  preview?: boolean;
  loading?: boolean;
  food: Food[];
  drinks: Drink[];
}

export default function EssenTrinkenPage(props: FoodAndDrinksPageProps) {
  const { preview, food, drinks } = props;

  return (
    <>
      <SiteLayout preview={preview}>
        <Menu food={food} drinks={drinks}></Menu>
      </SiteLayout>
    </>
  );
}
