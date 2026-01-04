import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fieldsets: [
    {
      name: 'content',
      title: 'Content',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'media',
      title: 'Media',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'metadata',
      title: 'Metadata',
      options: {collapsible: true, collapsed: false},
    },
  ],
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
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {title: 'Portable Text', value: 'portableText'},
          {title: 'Markdown', value: 'markdown'},
        ],
        layout: 'radio',
      },
      initialValue: 'portableText',
      fieldset: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'Rich text content for the post',
      fieldset: 'content',
      hidden: ({document}) => document?.contentType === 'markdown',
    }),
    defineField({
      name: 'markdownContent',
      title: 'Markdown Content',
      type: 'markdown',
      description: 'Alternative markdown content with live preview and image upload support',
      fieldset: 'content',
      hidden: ({document}) => document?.contentType !== 'markdown',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description:
        'Brief description of the post for previews and SEO (recommended: 150-160 characters)',
      validation: (Rule) => Rule.max(300),
      fieldset: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
      fieldset: 'media',
    }),
    defineField({
      name: 'cloudinaryImage',
      title: 'Cloudinary Image',
      type: 'cloudinary.asset',
      description: 'Image served from Cloudinary with advanced transformations',
      fieldset: 'media',
    }),
    defineField({
      name: 'codeExample',
      title: 'Code Example',
      type: 'code',
      description: 'Include a code example related to this post',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'Python', value: 'python'},
        ],
        withFilename: true,
      },
      fieldset: 'media',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Creation or last update date',
      fieldset: 'metadata',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'When this post was or will be published',
      fieldset: 'metadata',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      description: 'Select the author of this post',
      to: [{type: 'person'}],
      fieldset: 'metadata',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Select 1-5 categories for this post',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).max(5).error('Select between 1 and 5 categories'),
      fieldset: 'metadata',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add searchable tags to help categorize this post',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      fieldset: 'metadata',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Media',
      type: 'seoFields',
      description: 'SEO settings and social media optimization for this post',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
      author: 'author.firstName',
      date: 'publishedAt',
    },
    prepare({title, subtitle, media, author, date}) {
      return {
        title,
        subtitle: subtitle || (author ? `By ${author}` : 'No excerpt'),
        media,
      }
    },
  },
})
