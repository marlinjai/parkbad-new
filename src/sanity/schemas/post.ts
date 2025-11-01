// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { BookIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

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
      type: "text",
      // @ts-ignore - Sanity Studio supports this property
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .warning("Bitte geben Sie einen Titel ein."),
      description: "Drücken Sie Enter für Zeilenumbrüche im Titel. Diese werden später genau so angezeigt.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Beitragsinhalt",
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
      description: "Hauptbild für Karten und Vorschau auf der Homepage",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "detailsImage",
      title: "Detailseiten-Bild",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Optionales separates Bild für die Detailseite. Falls nicht angegeben, wird das Beitragsbild verwendet.",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "hideOverlay",
      title: "Nur Bild anzeigen (ohne Text-Overlay)",
      type: "boolean",
      description: "Aktivieren Sie diese Option, wenn das Bild bereits alle Informationen enthält und kein Text-Overlay angezeigt werden soll.",
      initialValue: false,
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
      description: "Standardmäßig 30 Tage ab heute. Beiträge werden nach diesem Datum nicht mehr auf der Homepage angezeigt.",
      initialValue: () => {
        // Default: 30 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        return defaultDate.toISOString();
      },
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
    defineField({
      name: "sendNewsletter",
      title: "Newsletter senden",
      type: "boolean",
      description: "Aktivieren Sie diese Option, um beim Veröffentlichen automatisch einen Newsletter zu versenden. Deaktivieren Sie diese Option, wenn Sie nur Änderungen vornehmen möchten, ohne einen Newsletter zu versenden.",
      initialValue: false,
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
