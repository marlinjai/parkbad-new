import React from 'react'
import type { drink } from 'lib/sanity.queries'
const categoryMap = {
  hotDrinks: 'Heiße Getränke',
  water: 'Wasser',
  juices: 'Saft & Co',
  softDrinks: 'Limo & Co',
  alcoholFreeBeers: 'Alkoholfreie Biere',
  beers: 'Biere & Co',
  wines: 'Weine & Co',
  prosecco: 'Prosecco & Sekt',
  shots: 'Schnäpse',
  longdrinksCocktails: 'Longdrinks & Cocktails',
}

export default function DrinksMenu({ drinks }: { drinks: drink[] }) {
  // Categorize drinks
  const categorizedDrinks = drinks.reduce((acc, curr) => {
    ;(acc[curr.category] = acc[curr.category] || []).push(curr)
    return acc
  }, {})

  return (
    <div className="w-pz100 h-vh80 overflow-y-auto">
      <h3 className="mb-pz3 mt-pz5 text-2sc">Getränke</h3>
      {Object.keys(categorizedDrinks).map((category, index) => (
        <div key={index} className=" mt-pz5">
          <h3 className="font-carlson text-2sc text-brand-accent-4">
            {categoryMap[category] || category}
          </h3>
          {/* Existing JSX for drinks */}
          {categorizedDrinks[category].map((drink, idx) => (
            <div
              key={idx}
              className="my-2 flex items-center justify-between border-b border-brand-colour-dark pb-2 text-1sc md:text-4sc "
            >
              <span className="w-pz45 text-left">{drink.drinkTitle}</span>
              <span className=" w-pz15 text-center text-brand-accent-4">
                {drink.size} <span className=" text-brand-colour-light">l</span>
              </span>
              <span className="w-pz40 text-right">
                {drink.regularPrice}{' '}
                <span className=" text-brand-colour-dark">€</span>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
