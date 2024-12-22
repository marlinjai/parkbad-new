import { defineField, defineType, SlugValidationContext } from "sanity";
import { BsImages } from "react-icons/bs";

export default defineType({
  name: "gallery",
  title: "Gallerie",
  icon: BsImages,
  type: "document",
  fields: [
    defineField({
      name: "galleryTitle",
      type: "string",
      title: "Galerietitel",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "galleryTitle",
        maxLength: 96,
        isUnique: (value: string, context: SlugValidationContext) =>
          context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          type: "image",
          options: { hotspot: true, metadata: ["palette"] },
          // fields: [
          //   {
          //     name: "alt",
          //     type: "string",
          //     title: "Alternative Text",
          //   },
          // ],
        },
      ],
    }),
  ],
});
