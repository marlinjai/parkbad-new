// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { defineField, defineType } from "sanity";
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
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlichungsdatum",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          type: "image",
          options: { 
            hotspot: true, 
            metadata: ["palette", "lqip"],
            storeOriginalFilename: true,
            accept: 'image/*',
            multiple: true
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Beschreibung des Bildes für Screenreader und SEO",
            },
            {
              name: "caption",
              type: "string",
              title: "Bildunterschrift",
              description: "Wird unter dem Bild angezeigt (optional)"
            },
            {
              name: "takenAt",
              type: "datetime",
              title: "Aufgenommen am",
              description: "Datum, wann das Foto aufgenommen wurde (optional)",
            }
          ],
        },
      ],
      options: {
        layout: 'grid',
        studioLayout: {
          images: {
            directUploads: true,
            sources: ['filesystem', 'url', 'unsplash'],
            multiple: true,
            batchUpload: {
              enabled: true,
              folderSelect: true,
              maxFiles: 50
            }
          }
        }
      }
    }),
  ],
  preview: {
    select: {
      title: 'galleryTitle',
      media: 'images.0',
      subtitle: 'publishedAt'
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle 
          ? new Date(subtitle).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
          : 'Kein Datum'
      }
    }
  }
});
