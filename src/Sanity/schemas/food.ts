import { defineField, defineType } from 'sanity'

import subBusinessType from './subBusiness'

import { PiPizzaDuotone } from 'react-icons/pi'

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
  name: 'food',
  title: 'Essen',
  icon: PiPizzaDuotone,
  type: 'document',
  fields: [
    defineField({
      name: 'foodTitle',
      title: 'Name des Gerichts',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'foodTitle',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'regularPrice',
      title: 'Preis',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'discount',
      title: 'Rabatt in %',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          // Add pre-defined categories here
          { title: 'Appetizers', value: 'Appetizers' },
          { title: 'Hauptgerichte', value: 'Main Course' },
          { title: 'Nachspeisen', value: 'Desserts' },
          { title: 'Pizzen', value: 'Pizzas' },
          { title: 'Salate', value: 'Salads' },

          // add more as needed
        ],
      },
    }),
    defineField({
      name: 'seller',
      title: 'Verkäufer',
      type: 'reference',
      to: [{ type: subBusinessType.name }],
    }),
  ],
})
