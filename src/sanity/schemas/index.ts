// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import author from "./author";
import customevent from "./customevent";
import drinks from "./drinks";
import food from "./food";
import post from "./post";
import subBusiness from "./subBusiness";
import zoomgallery from "./gallery";
import drinkCategories from "./drinkCategories";
import foodCategories from "./foodCategories";
import contactSettings from "./contactSettings";

const schemas = [
  subBusiness,
  author,
  post,
  customevent,
  food,
  drinks,
  drinkCategories,
  foodCategories,
  zoomgallery,
  contactSettings,
];

export default schemas;
