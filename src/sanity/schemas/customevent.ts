// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";
import { BsFillSunFill } from "react-icons/bs";
import NewsletterTestButton from "@/app/_components/Sanity_Components/NewsletterTestButton";

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
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
      description: "Drücken Sie Enter für Zeilenumbrüche im Titel. Diese werden später genau so angezeigt.",
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
      description: "Optionales separates Bild für die Detailseite. Falls nicht angegeben, wird das Eventbild verwendet.",
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
      description: "Aktivieren Sie diese Option, wenn das Eventbild bereits alle Informationen enthält und kein Text-Overlay angezeigt werden soll.",
      initialValue: false,
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
      name: "showUntilDate",
      title: "Ende der Anzeige auf der Homepage",
      type: "datetime",
      description: "Wird automatisch auf den letzten Veranstaltungstag gesetzt, falls Veranstaltungstage definiert sind.",
      initialValue: (_, context) => {
        // Try to get the last event day from eventDays
        const document = context?.document;
        if (document?.eventDays && Array.isArray(document.eventDays) && document.eventDays.length > 0) {
          // Sort eventDays by date and get the last one
          const sortedDays = [...document.eventDays].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const lastDay = sortedDays[sortedDays.length - 1];
          if (lastDay?.date) {
            // Set to end of the last event day (23:59:59)
            const lastDate = new Date(lastDay.date);
            lastDate.setHours(23, 59, 59, 999);
            return lastDate.toISOString();
          }
        }
        // Fallback: 30 days from now if no event days are set
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + 30);
        return fallbackDate.toISOString();
      },
    }),
    defineField({
      name: "author",
      title: "Author",
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
    defineField({
      name: "newsletterTest",
      title: "Newsletter Test",
      type: "object",
      components: {
        input: NewsletterTestButton,
      },
      fields: [],
      description: "Versenden Sie eine Test-E-Mail bevor Sie den Newsletter an alle Abonnenten senden.",
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
