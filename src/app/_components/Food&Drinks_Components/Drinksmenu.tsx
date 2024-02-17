import { Drink, DrinkCategory } from "@/types/sanityTypes";
import React from "react";

const categoryMap = {
  hotDrinks: "Heiße Getränke",
  water: "Wasser",
  juices: "Saft & Co",
  softDrinks: "Limo & Co",
  alcoholFreeBeers: "Alkoholfreie Biere",
  bottledBeers: "Flaschen Bier",
  fassBeers: "Fass Bier",
  wines: "Weine & Co",
  prosecco: "Prosecco & Sekt",
  shots: "Schnäpse",
  longdrinksCocktails: "Longdrinks & Cocktails",
};
// Define a type for the categorizedDrinks object
// Define a type for the categorizedDrinks object
type CategorizedDrinks = {
  [seller: string]: {
    [category: string]: Drink[];
  };
};

export default function DrinksMenu({
  drinkcategories,
}: {
  drinkcategories: DrinkCategory[];
}) {
  // Create an object to map sellers to their drinks, categorized
  const categorizedDrinks = drinkcategories.reduce<CategorizedDrinks>(
    (acc, { drinks, name }) => {
      // Check if drinks is not null or undefined before calling forEach
      if (drinks) {
        drinks.forEach((drink) => {
          // Check if drink.seller is not null before destructuring
          if (drink.seller) {
            const {
              seller: { name: sellerName },
            } = drink;
            if (!acc[sellerName]) {
              acc[sellerName] = {};
            }
            if (!acc[sellerName][name]) {
              acc[sellerName][name] = [];
            }
            acc[sellerName][name].push(drink);
          }
        });
      }
      return acc;
    },
    {}
  );

  return (
    <div className=" text-brand-colour-light w-pz100 h-vh70 sm:h-vh80">
      {Object.entries(categorizedDrinks).map(([seller, categories], index) => (
        <div key={index}>
          <h2 className="font-carlson text-2sc text-brand-accent-4">
            {seller}
          </h2>
          {Object.entries(categories).map(([category, drinks], index) => (
            <div key={index} className="mb-pz10">
              <h3 className="font-carlson text-5sc text-brand-colour-dark py-5">
                {categoryMap[category as keyof typeof categoryMap] || category}
              </h3>
              {/* Existing JSX for drinks */}
              {drinks.map((drink, idx) => (
                <div
                  key={idx}
                  className="my-2 flex items-center justify-between border-b border-brand-colour-dark pb-2 text-1sc 2xl:text-4sc "
                >
                  <span className="w-pz45 text-left">{drink.drinkTitle}</span>
                  <p className="w-pz15 text-right text-brand-accent-4">
                    {drink.size ? drink.size : " "}
                    <span className=" text-brand-colour-light">
                      {drink.size ? " l" : ""}
                    </span>
                  </p>
                  <span className="w-pz40 text-right">
                    {drink.regularPrice ? drink.regularPrice.toFixed(2) : " "}
                    <span className=" text-brand-colour-dark">€</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
