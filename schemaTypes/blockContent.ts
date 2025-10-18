import {defineType, defineField} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                options: {
                  list: [
                    {title: 'URL', value: 'href'},
                    {title: 'Post', value: 'post'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'href',
                validation: (Rule) =>
                  Rule.custom(() => true).uri({
                    scheme: ['/^http$/', '/^https$/'],
                    allowRelative: false,
                    relativeOnly: false,
                    allowCredentials: false,
                  }),
              }),
              defineField({
                name: 'post',
                type: 'reference',
                to: [{type: 'post'}],
                hidden: ({parent}) => parent?.linkType !== 'post',
                validation: (Rule) => Rule.custom(() => true),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
              }),
            ],
          },
        ],
      },
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'H5', value: 'h5'},
        {title: 'H6', value: 'h6'},
        {title: 'Quote', value: 'blockquote'},
      ],
    },
    {
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          type: 'string',
        }),
      ],
    },
    {
      type: 'code',
      title: 'Code Block',
    },
  ],
})
