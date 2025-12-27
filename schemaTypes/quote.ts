import {defineType, defineField} from 'sanity'

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      description: 'The quote itself',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Who said or wrote this quote',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'author',
    },
    prepare({title, subtitle}) {
      return {
        title: title?.length > 50 ? `${title.substring(0, 50)}...` : title,
        subtitle: `— ${subtitle}`,
      }
    },
  },
})
