import {defineType, defineField} from 'sanity'

export const asset = defineType({
  name: 'asset',
  title: 'Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image File',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption that will appear with the image',
        }),
      ],
      validation: (Rule) => Rule.required().error('Image is required for assets'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      description: 'description',
    },
    prepare({title, image, description}) {
      return {
        title: `🖼️ ${title}`,
        subtitle: description || 'Image Asset',
        media: image,
      }
    },
  },
  orderings: [
    {
      title: 'Title',
      name: 'title',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Modified Date',
      name: '_updatedAt',
      by: [{field: '_updatedAt', direction: 'desc'}],
    },
  ],
})
