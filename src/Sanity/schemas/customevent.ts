import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";
import { BsFillSunFill } from "react-icons/bs";

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
  name: "customevent",
  title: "Veranstaltung",
  icon: BsFillSunFill,
  type: "document",
  fields: [
    defineField({
      name: "eventTitle",
      title: "Veranstaltungstitel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "eventTitle",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventContent",
      title: "Event Beschreibung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "excerpt",
      title: "Kurzbeschreibung",
      type: "text",
    }),
    defineField({
      name: "eventImage",
      title: "Eventbild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "eventStart",
      title: "Event-Start",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "eventEnd",
      title: "Event-Ende",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: "eventTitle",
      author: "author.name",
      date: "eventDate",
      media: "eventImage",
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
