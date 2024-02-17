import { FoodCategory, Food } from "@/types/sanityTypes";
import React from "react";

// Define category map for foods
const categoryMap = {
  Appetizers: "Vorspeisen",
  "Main Course": "Hauptgerichte",
  Desserts: "Nachspeisen",
  Pizzas: "Pizzen",
  Salads: "Salate",
};

// Define a type for the categorizedFoods object, grouping by seller
type CategorizedFoodsBySeller = {
  [sellerName: string]: {
    [category: string]: Food[];
  };
};

export default function FoodMenu({
  foodCategories,
}: {
  foodCategories: FoodCategory[];
}) {
  // Transform foodCategories into a structure categorized by seller
  const categorizedFoodsBySeller =
    foodCategories.reduce<CategorizedFoodsBySeller>((acc, category) => {
      category.foods.forEach((food) => {
        const sellerName = food.seller ? food.seller.name : "Unknown Seller";
        if (!acc[sellerName]) {
          acc[sellerName] = {};
        }
        if (!acc[sellerName][category.name]) {
          acc[sellerName][category.name] = [];
        }
        acc[sellerName][category.name].push(food);
      });
      return acc;
    }, {});

  return (
    <div className="text-brand-colour-light w-pz100 h-vh70 sm:h-vh80">
      {Object.entries(categorizedFoodsBySeller).map(
        ([sellerName, categories], sellerIndex) => (
          <div key={sellerIndex}>
            <h2 className="font-carlson text-2sc text-brand-accent-4">
              {sellerName}
            </h2>
            {Object.entries(categories).map(
              ([categoryName, foods], categoryIndex) => (
                <div key={categoryIndex} className="mb-pz10">
                  <h3 className="font-carlson text-5sc py-5 text-brand-colour-dark">
                    {categoryMap[categoryName as keyof typeof categoryMap] ||
                      categoryName}
                  </h3>
                  {foods.map((food, foodIndex) => (
                    <div
                      key={foodIndex}
                      className="my-2 flex items-center justify-between border-b border-brand-colour-dark pb-2 text-1sc 2xl:text-4sc"
                    >
                      <span className="w-4/12 text-left">{food.foodTitle}</span>
                      <span className="w-2/12 text-right">
                        {food.regularPrice ? food.regularPrice.toFixed(2) : " "}
                        <span className="text-brand-colour-dark">€</span>
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )
      )}
    </div>
  );
}
