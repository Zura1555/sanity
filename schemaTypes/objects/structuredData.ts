import {defineType, defineField} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

/**
 * Structured Data (JSON-LD) Object Type
 * For adding schema.org markup to content
 */
export const structuredData = defineType({
  name: 'structuredData',
  title: 'Structured Data (JSON-LD)',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'schemaType',
      title: 'Schema Type',
      type: 'string',
      description: 'Type of schema.org markup',
      options: {
        list: [
          {title: 'Article', value: 'Article'},
          {title: 'BlogPosting', value: 'BlogPosting'},
          {title: 'NewsArticle', value: 'NewsArticle'},
          {title: 'Product', value: 'Product'},
          {title: 'Review', value: 'Review'},
          {title: 'Recipe', value: 'Recipe'},
          {title: 'Event', value: 'Event'},
          {title: 'FAQ', value: 'FAQPage'},
          {title: 'How-To', value: 'HowTo'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'BlogPosting',
    }),
    defineField({
      name: 'customJson',
      title: 'Custom JSON-LD',
      type: 'code',
      description: 'Custom JSON-LD schema (will override auto-generated schema)',
      hidden: ({parent}) => parent?.schemaType !== 'custom',
    }),
    defineField({
      name: 'articleSection',
      title: 'Article Section',
      type: 'string',
      description: 'Category or section (e.g., "Technology", "Health")',
      hidden: ({parent}) => !['Article', 'BlogPosting', 'NewsArticle'].includes(parent?.schemaType),
    }),
    defineField({
      name: 'wordCount',
      title: 'Word Count',
      type: 'number',
      description: 'Approximate word count (will be auto-calculated if left empty)',
      hidden: ({parent}) => !['Article', 'BlogPosting', 'NewsArticle'].includes(parent?.schemaType),
    }),
  ],
  preview: {
    select: {
      schemaType: 'schemaType',
      section: 'articleSection',
    },
    prepare({schemaType, section}) {
      return {
        title: schemaType || 'Structured Data',
        subtitle: section ? `Section: ${section}` : 'Schema.org markup',
      }
    },
  },
})
