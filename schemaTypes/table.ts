import {defineType, defineField} from 'sanity'
import {ThListIcon} from '@sanity/icons'
import {TableCanvasInput} from '../components/TableCanvasInput'

export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  components: {
    input: TableCanvasInput,
  },
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
