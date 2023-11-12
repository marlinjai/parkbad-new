import { Food } from "@/types/sanityTypes";
import React from "react";

// Define category map for foods
const categoryMap = {
  Appetizers: "Vorspeisen",
  "Main Course": "Hauptgerichte",
  Desserts: "Nachspeisen",
  Pizzas: "Pizzen",
  Salads: "Salate",
};

// Define a type for the categorizedFoods object
type CategorizedFoods = {
  [seller: string]: {
    [category: string]: Food[];
  };
};

export default function FoodMenu({ foods }: { foods: Food[] }) {
  const categorizedFoods = foods.reduce<CategorizedFoods>(
    (acc, { seller: { name: seller }, category, ...rest }) => {
      if (!acc[seller]) {
        acc[seller] = {};
      }

      if (!acc[seller][category]) {
        acc[seller][category] = [];
      }

      acc[seller][category].push({ seller, category, ...rest });

      return acc;
    },
    {}
  );

  return (
    <div className="w-pz100 h-vh80 overflow-y-auto">
      <h3 className="mb-pz3 mt-pz5 text-2sc">Essen</h3>
      {Object.keys(categorizedFoods).map((seller) => (
        <div key={seller}>
          <h2 className="font-carlson text-2sc text-brand-accent-4">
            {seller}
          </h2>
          {Object.keys(categorizedFoods[seller]).map((category) => (
            <div key={`${seller}-${category}`}>
              {/* Use category map for display */}
              <h3 className="font-carlson text-2sc text-brand-colour-dark">
                {categoryMap[category] || category}
              </h3>
              {categorizedFoods[seller][category].map(
                (food: Food, foodIndex: number) => (
                  <div
                    key={`${seller}-${category}-${foodIndex}`}
                    // rest of your code
                  />
                )
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
