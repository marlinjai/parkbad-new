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

export default function FoodMenu({ food }: { food: Food[] }) {
  console.log(food);
  const categorizedFoods = food.reduce<CategorizedFoods>(
    (acc, { seller: { name: seller }, category, ...rest }) => {
      if (!acc[seller]) {
        acc[seller] = {};
      }

      if (!acc[seller][category]) {
        acc[seller][category] = [];
      }
      acc[seller][category].push({
        seller: {
          name: seller,
          title: undefined,
          picture: undefined,
        },
        category,
        ...rest,
      });

      return acc;
    },
    {}
  );

  return (
    <div className="text-brand-colour-light w-pz100 h-vh80 overflow-y-auto">
      <h3 className="mb-pz3 mt-pz5 text-2sc">Essen</h3>
      {Object.keys(categorizedFoods).map((seller, sellerIndex) => (
        <div key={sellerIndex}>
          <h2 className="font-carlson text-2sc text-brand-accent-4">
            {seller}
          </h2>
          {Object.keys(categorizedFoods[seller]).map(
            (category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Use category map for display */}
                <h3 className="font-carlson text-2sc text-brand-colour-dark">
                  {categoryMap[category as keyof typeof categoryMap] ||
                    category}
                </h3>
                {categorizedFoods[seller][category].map((food, foodIndex) => (
                  <div
                    key={foodIndex}
                    className="my-2 flex items-center justify-between border-b border-brand-colour-dark pb-2 text-1sc md:text-4sc"
                  >
                    <span className="w-4/12 text-left">{food.foodTitle}</span>
                    <span className="w-2/12 text-right">
                      {food.regularPrice}{" "}
                      <span className="text-brand-colour-dark">€</span>
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
