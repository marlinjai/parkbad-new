import { BookIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import {
  defineArrayMember,
  defineField,
  defineType,
  SlugValidationContext,
} from "sanity";

import authorType from "./author";

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
  name: "post",
  title: "Beitrag",
  icon: BookIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Beitragstitel",
      type: "string",
      validation: (rule) =>
        rule
          .max(27)
          .warning("Ein Titel darf nicht mehr als 27 Zeichen haben.")
          .required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value: string, context: SlugValidationContext) =>
          context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Beitragsinhalt",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Normal Left", value: "normalLeft" },
            { title: "Normal Center", value: "normalCenter" },
            { title: "Normal Right", value: "normalRight" },
            { title: "H1 Left", value: "h1Left" },
            { title: "H1 Center", value: "h1Center" },
            { title: "H1 Right", value: "h1Right" },
            { title: "H2 Left", value: "h2Left" },
            { title: "H2 Center", value: "h2Center" },
            { title: "H2 Right", value: "h2Right" },
            { title: "H3 Left", value: "h3Left" },
            { title: "H3 Center", value: "h3Center" },
            { title: "H3 Right", value: "h3Right" },
            { title: "H4 Left", value: "h4Left" },
            { title: "H4 Center", value: "h4Center" },
            { title: "H4 Right", value: "h4Right" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              type: "string",
              title: "Image caption",
              description: "Caption displayed below the image.",
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessiblity.",
            }),
          ],
        }),
        defineArrayMember({
          type: "file",
          title: "Video",
          options: {
            accept: "video/*",
          },
          fields: [
            defineField({
              name: "caption",
              type: "string",
              title: "Video caption",
              description: "Caption displayed below the video.",
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Vorschautext",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Beitragsbild",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Veröffentlichungsdatum",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "showUntilDate",
      title: "Ende der Anzeige auf der Homepage",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
