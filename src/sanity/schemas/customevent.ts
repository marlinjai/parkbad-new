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
      of: [
        {
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
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Image caption",
              description: "Caption displayed below the image.",
            },
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessiblity.",
            },
          ],
        },
        {
          type: "file",
          title: "Video",
          options: {
            accept: "video/*",
          },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Video caption",
              description: "Caption displayed below the video.",
            },
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
        },
      ],
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
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "eventDays",
      title: "Veranstaltungstage",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "date",
              title: "Datum",
              type: "date",
              validation: (rule) => rule.required(),
            },
            {
              name: "startTime",
              title: "Startzeit",
              type: "string",
              options: {
                list: Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? "00" : "30";
                  return {
                    title: `${hour.toString().padStart(2, "0")}:${minute}`,
                    value: `${hour.toString().padStart(2, "0")}:${minute}`,
                  };
                }),
              },
              validation: (rule) => rule.required(),
            },
            {
              name: "endTime",
              title: "Endzeit",
              type: "string",
              options: {
                list: Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? "00" : "30";
                  return {
                    title: `${hour.toString().padStart(2, "0")}:${minute}`,
                    value: `${hour.toString().padStart(2, "0")}:${minute}`,
                  };
                }),
              },
              validation: (rule) => rule.required(),
            },
            {
              name: "description",
              title: "Tagesbeschreibung (optional)",
              type: "text",
            },
          ],
          preview: {
            select: {
              date: "date",
              startTime: "startTime",
              endTime: "endTime",
              description: "description",
            },
            prepare({ date, startTime, endTime, description }) {
              return {
                title: `${new Date(date).toLocaleDateString(
                  "de-DE"
                )} | ${startTime} - ${endTime}`,
                subtitle: description || "Keine Beschreibung",
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "eventStart",
      title: "Event-Start (Legacy)",
      type: "datetime",
      hidden: true,
    }),
    defineField({
      name: "eventEnd",
      title: "Event-Ende (Legacy)",
      type: "datetime",
      hidden: true,
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
