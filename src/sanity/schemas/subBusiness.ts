// @ts-nocheck - Sanity schema TypeScript type checking disabled for this file
import { CaseIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subBusiness',
  title: 'Unternehmen im Parkbad',
  icon: CaseIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessiblity.',
        },
      ],
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
})
