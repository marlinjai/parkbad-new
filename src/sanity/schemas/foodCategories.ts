// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "foodCategories",
  title: "Speise Kategorien",
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
      name: "foods",
      title: "Speisen",
      type: "array",
      of: [{ type: "reference", to: [{ type: "food" }] }],
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
