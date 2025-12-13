import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Category name (1-100 characters)',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this category (max 500 characters)',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Choose a color to represent this category',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Red', value: 'red'},
          {title: 'Purple', value: 'purple'},
          {title: 'Orange', value: 'orange'},
          {title: 'Gray', value: 'gray'},
        ],
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true // Optional field
          const validColors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'gray']
          return validColors.includes(value) || 'Please select a valid color'
        }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      description: 'Mark as featured to highlight this category',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      description: 'Optional thumbnail image for the category',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags',
          },
        }),
      ],
    }),
    defineField({
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      description: 'Select a parent category to create a hierarchy',
      to: [{type: 'category'}],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // Prevent self-reference
          if (value?._ref === context.document?._id) {
            return 'A category cannot be its own parent'
          }
          // Note: Circular reference check would require querying the database
          // This basic check prevents direct self-reference
          return true
        }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first (e.g., 1, 2, 3...)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
      featured: 'featured',
    },
    prepare({title, subtitle, media, featured}) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: subtitle || 'No description',
        media,
      }
    },
  },
})
