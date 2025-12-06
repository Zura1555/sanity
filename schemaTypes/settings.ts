import {defineType, defineField} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
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
          styles: [{title: 'Normal', value: 'normal'}],
        },
      ],
    }),
    defineField({
      name: 'markdownDescription',
      title: 'Markdown Description',
      type: 'markdown',
      description: 'Site description in markdown format with image support',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.custom(() => true),
        }),
        defineField({
          name: 'metadataBase',
          title: 'Metadata Base',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['/^http$/', '/^https$/'],
              allowRelative: false,
              relativeOnly: false,
              allowCredentials: false,
            }),
        }),
      ],
    }),
    defineField({
      name: 'cloudinaryLogo',
      title: 'Cloudinary Logo',
      type: 'cloudinary.asset',
      description: 'Logo served from Cloudinary with optimized transformations',
    }),
    defineField({
      name: 'introVideo',
      title: 'Intro Video',
      type: 'imagekit.video',
      description: 'Site introduction video hosted on ImageKit',
    }),
    defineField({
      name: 'openGraphSiteName',
      title: 'Open Graph Site Name',
      type: 'string',
      description: 'The name of your site for Open Graph meta tags',
    }),
    defineField({
      name: 'twitterSite',
      title: 'Twitter Site Handle',
      type: 'string',
      description: 'Your site\'s Twitter handle (e.g., @yoursite)',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      description: 'Default description for posts that don\'t have custom SEO descriptions',
    }),
  ],
})
