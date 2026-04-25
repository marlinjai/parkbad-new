// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";
import { BsFillSunFill } from "react-icons/bs";
import NewsletterTestButton from "@/app/_components/Sanity_Components/NewsletterTestButton";
import NewsletterStatusPanel from "@/app/_components/Sanity_Components/NewsletterStatusPanel";
import NewsletterSendButton from "@/app/_components/Sanity_Components/NewsletterSendButton";

const HALF_HOUR_LIST = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { title: value, value };
});

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
      name: "customOverlayText",
      title: "Custom Overlay Text (für Slider)",
      type: "text",
      description: "Optional: Überschreibt den Standard-Titel im Slider-Overlay. Unterstützt HTML und Emoji. Beispiel: ✨ 28–30 NOV · 5–7 DEZ ✨",
    }),
    defineField({
      name: "customOverlaySubtext",
      title: "Custom Overlay Untertitel (für Slider)",
      type: "text",
      description: "Optional: Zeigt einen Untertitel unter dem Custom Overlay Text an. Wird in Gold angezeigt. Beispiel: Fr 16–22 Uhr · Sa/So 14–22 Uhr",
    }),
    defineField({
      name: "eventDays",
      title: "Veranstaltungstage",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "date",
              title: "Datum",
              type: "date",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "slots",
              title: "Zeitfenster",
              type: "array",
              validation: (rule) => rule.required().min(1),
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "startTime",
                      title: "Startzeit",
                      type: "string",
                      options: { list: HALF_HOUR_LIST },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "endTime",
                      title: "Endzeit",
                      type: "string",
                      options: { list: HALF_HOUR_LIST },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "label",
                      title: "Bezeichnung (Pflicht bei mehreren Zeitfenstern)",
                      type: "string",
                      validation: (rule) =>
                        rule.custom((label, context) => {
                          const path = context.path;
                          // path shape: ['eventDays', {_key: 'dayKey'}, 'slots', {_key: 'slotKey'}, 'label']
                          const daySegment = path[1];
                          const doc = context.document as any;
                          const days: Array<{ _key?: string; slots?: unknown[] }> =
                            doc?.eventDays ?? [];

                          let slots: unknown[] = [];
                          if (typeof daySegment === "number") {
                            slots = days[daySegment]?.slots ?? [];
                          } else if (daySegment && typeof daySegment === "object" && "_key" in daySegment) {
                            const day = days.find((d) => d._key === (daySegment as { _key: string })._key);
                            slots = day?.slots ?? [];
                          }

                          if (slots.length > 1 && !label?.trim()) {
                            return "Bei mehreren Zeitfenstern ist eine Bezeichnung erforderlich.";
                          }
                          return true;
                        }),
                    }),
                  ],
                  preview: {
                    select: { startTime: "startTime", endTime: "endTime", label: "label" },
                    prepare: ({ startTime, endTime, label }) => ({
                      title: `${startTime} - ${endTime}`,
                      subtitle: label || "ohne Bezeichnung",
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { date: "date", slots: "slots" },
            prepare: ({ date, slots }) => {
              const dateStr = date ? new Date(date).toLocaleDateString("de-DE") : "kein Datum";
              const slotCount = (slots ?? []).length;
              if (slotCount === 0) {
                return { title: dateStr, subtitle: "keine Zeitfenster" };
              }
              if (slotCount === 1) {
                const s = slots[0];
                const labelPart = s.label ? ` · ${s.label}` : "";
                return { title: dateStr, subtitle: `${s.startTime} - ${s.endTime}${labelPart}` };
              }
              return { title: dateStr, subtitle: `${slotCount} Zeitfenster` };
            },
          },
        },
      ],
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
        const document = context?.document;
        const days = (document?.eventDays as Array<{ date?: string; slots?: Array<{ endTime?: string }> }>) ?? [];
        if (days.length > 0) {
          const sortedDays = [...days].sort(
            (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
          );
          const lastDay = sortedDays[sortedDays.length - 1];
          if (lastDay?.date) {
            const lastDate = new Date(lastDay.date);
            // Find latest endTime among slots; fall back to end of day
            const slots = lastDay.slots ?? [];
            const latestEnd = slots.reduce<string | null>((acc, s) => {
              if (!s.endTime) return acc;
              if (!acc || s.endTime.localeCompare(acc) > 0) return s.endTime;
              return acc;
            }, null);
            if (latestEnd) {
              const [hh, mm] = latestEnd.split(":").map(Number);
              lastDate.setHours(hh, mm, 0, 0);
            } else {
              lastDate.setHours(23, 59, 59, 999);
            }
            return lastDate.toISOString();
          }
        }
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
      name: "newsletterStatus",
      title: "Newsletter Status",
      type: "object",
      readOnly: true,
      components: { input: NewsletterStatusPanel },
      fields: [
        defineField({ name: "lastSentAt", title: "Zuletzt versendet", type: "datetime" }),
        defineField({
          name: "lastSentTrigger",
          title: "Auslöser",
          type: "string",
          options: { list: [{ title: "Manuell", value: "manual" }] },
        }),
        defineField({ name: "lastSentBroadcastId", title: "Broadcast-ID", type: "string" }),
        defineField({ name: "lastSentRecipientCount", title: "Empfänger", type: "number" }),
        defineField({ name: "lastSentContentHash", title: "Inhalts-Hash beim Senden", type: "string" }),
        defineField({ name: "lastTestSentAt", title: "Letzter Test", type: "datetime" }),
        defineField({ name: "lastTestContentHash", title: "Inhalts-Hash beim Test", type: "string" }),
        defineField({
          name: "sendHistory",
          title: "Verlauf",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "sentAt", type: "datetime" }),
              defineField({ name: "trigger", type: "string" }),
              defineField({ name: "broadcastId", type: "string" }),
              defineField({ name: "recipientCount", type: "number" }),
            ],
          }],
        }),
      ],
    }),
    defineField({
      name: "newsletterTest",
      title: "Newsletter Test",
      type: "string",
      components: {
        input: NewsletterTestButton,
      },
      description: "Versenden Sie eine Test-E-Mail bevor Sie den Newsletter an alle Abonnenten senden.",
      readOnly: true,
      initialValue: "",
    }),
    defineField({
      name: "newsletterSend",
      title: "Newsletter senden",
      type: "string",
      components: { input: NewsletterSendButton },
      readOnly: true,
      initialValue: "",
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
