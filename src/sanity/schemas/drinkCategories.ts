import { defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "drinkCategories",
  title: "Getränke Kategorien",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "drinks",
      title: "Getränke",
      type: "array",
      of: [{ type: "reference", to: [{ type: "drinks" }] }],
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
    }),
    orderRankField({ type: "category" }),
  ],
});
