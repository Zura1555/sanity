import {defineType, defineField} from 'sanity'

export const code = defineType({
  name: 'code',
  title: 'Code',
  type: 'object',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
    }),
    defineField({
      name: 'highlightedLines',
      title: 'Highlighted lines',
      type: 'array',
      of: [
        {
          type: 'number',
          title: 'Highlighted line',
        },
      ],
    }),
  ],
})
