import {defineType, defineField} from 'sanity'

export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      rows: 'rows',
    },
    prepare({rows}) {
      const rowCount = rows?.length || 0
      const colCount = rows?.[0]?.cells?.length || 0
      return {
        title: `Table (${rowCount}×${colCount})`,
      }
    },
  },
})
