import {defineType, defineField} from 'sanity'
import {SearchIcon} from '@sanity/icons'

/**
 * Reusable SEO Object Type
 * Can be used across multiple document types
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (50-60 characters recommended). Leave empty to use post title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description (150-160 characters recommended)',
      validation: (Rule) =>
        Rule.max(160)
          .warning('Descriptions over 160 characters may be truncated')
          .min(50)
          .warning('Descriptions under 50 characters may be too short'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Specify the canonical URL if this content exists elsewhere',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Custom image for social media sharing (1200x630px recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Focus Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Target keywords for this content (3-5 recommended)',
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(10).warning('Too many keywords may dilute SEO focus'),
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'No Follow',
      type: 'boolean',
      description: 'Prevent search engines from following links on this page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
      keywords: 'keywords',
    },
    prepare({title, keywords}) {
      return {
        title: title || 'SEO Settings',
        subtitle:
          keywords && keywords.length > 0 ? `Keywords: ${keywords.join(', ')}` : 'No keywords set',
      }
    },
  },
})
