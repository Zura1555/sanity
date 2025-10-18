import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
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
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
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
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(5).error('At least one category is required'),
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
  views: [
    // Main editing view
    {
      name: 'editor',
      title: 'Editor',
      type: 'form',
    },
    // Draft version view - shows draft content
    {
      name: 'draft',
      title: '📝 Draft Version',
      type: 'form',
      options: {
        perspective: 'drafts',
        // Only show fields that are relevant for drafts
      },
    },
    // Published version view - shows published content
    {
      name: 'published', 
      title: '✅ Published Version',
      type: 'form',
      options: {
        perspective: 'published',
        // Only show fields that are relevant for published content
      },
    },
    // Side-by-side comparison view
    {
      name: 'comparison',
      title: '🔄 Draft vs Published',
      type: 'component',
      component: ({document}) => {
        // This would be a custom component for comparison
        return null
      },
    },
  ],
})
