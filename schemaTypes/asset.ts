import {defineType, defineField} from 'sanity'

export const asset = defineType({
  name: 'asset',
  title: 'Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Folder', value: 'folder'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().valid(['folder', 'image']),
    }),
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
      title: 'Image',
      type: 'image',
      hidden: ({parent}) => parent?.type !== 'image',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.custom(() => true),
        }),
      ],
      validation: (Rule) => Rule.custom(() => true),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'parentFolder',
      title: 'Parent Folder',
      type: 'reference',
      to: [{type: 'asset'}],
      options: {
        filter: 'type == "folder"',
      },
      validation: (Rule) => Rule.custom(() => true),
    }),
    defineField({
      name: 'color',
      title: 'Folder Color',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'folder',
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
        layout: 'radio',
      },
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
})
