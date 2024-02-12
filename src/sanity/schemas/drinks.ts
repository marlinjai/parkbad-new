import { defineField, defineType } from "sanity";

import subBusinessType from "./subBusiness";

import { BiSolidDrink } from "react-icons/bi";

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: "drinks",
  title: "Getränke",
  icon: BiSolidDrink,
  type: "document",
  fields: [
    defineField({
      name: "drinkTitleIntern",
      title: "Name des Getränks",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "drinkTitle",
      title: "Name des Getränks auf der Karte",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "drinkTitleIntern",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "hotDrinks", value: "Heiße Getränke" },
          { title: "water", value: "Wasser" },
          { title: "juices", value: "Saft & Co" },
          { title: "softDrinks", value: "Limo & Co" },
          { title: "alcoholFreeBeers", value: "Alkoholfreie Biere" },
          { title: "bottledBeers", value: "Flaschen Bier" },
          { title: "fassBeers", value: "Fass Bier" },
          { title: "wines", value: "Weine & Co" },
          { title: "prosecco", value: "Prosecco & Sekt" },
          { title: "shots", value: "Schnäpse" },
          { title: "longdrinksCocktails", value: "Longdrinks & Cocktails" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alcoholic",
      title: "alkoholisch",
      type: "boolean",
    }),
    defineField({
      name: "size",
      title: "Gebindegröße",
      type: "number",
    }),
    defineField({
      name: "regularPrice",
      title: "Preis",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "discount",
      title: "Rabatt in %",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "seller",
      title: "Verkäufer",
      type: "reference",
      to: [{ type: subBusinessType.name }],
    }),
  ],
});
