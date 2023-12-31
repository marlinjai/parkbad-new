import { Drink } from "@/types/sanityTypes";
import React from "react";

const categoryMap = {
  hotDrinks: "Heiße Getränke",
  water: "Wasser",
  juices: "Saft & Co",
  softDrinks: "Limo & Co",
  alcoholFreeBeers: "Alkoholfreie Biere",
  beers: "Biere & Co",
  wines: "Weine & Co",
  prosecco: "Prosecco & Sekt",
  shots: "Schnäpse",
  longdrinksCocktails: "Longdrinks & Cocktails",
};

// Define a type for the categorizedDrinks object
type CategorizedDrinks = {
  [category: string]: Drink[];
};

export default function DrinksMenu({ drinks }: { drinks: Drink[] }) {
  // Categorize drinks
  const categorizedDrinks = drinks.reduce<CategorizedDrinks>((acc, curr) => {
    (acc[curr.category] = acc[curr.category] || []).push(curr);
    return acc;
  }, {});

  return (
    <div className=" text-brand-colour-light w-pz100 h-vh70 sm:h-vh80 overflow-y-auto">
      {Object.keys(categorizedDrinks).map((category, index) => (
        <div key={index} className=" mt-pz5">
          <h3 className="font-carlson text-5sc md:text-2sc text-brand-colour-dark py-5">
            {categoryMap[category as keyof typeof categoryMap] || category}
          </h3>
          {/* Existing JSX for drinks */}
          {categorizedDrinks[category].map((drink, idx) => (
            <div
              key={idx}
              className="my-2 flex items-center justify-between border-b border-brand-colour-dark pb-2 text-1sc lg:text-4sc "
            >
              <span className="w-pz45 text-left">{drink.drinkTitle}</span>
              <span className=" w-pz15 text-center text-brand-accent-4">
                {drink.size} <span className=" text-brand-colour-light">l</span>
              </span>
              <span className="w-pz40 text-right">
                {drink.regularPrice}{" "}
                <span className=" text-brand-colour-dark">€</span>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
