import {defineType, defineField} from 'sanity'

export const codeExample = defineType({
  name: 'codeExample',
  title: 'Code Example',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for this code example',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description of what this code does',
    }),
    defineField({
      name: 'codeContent',
      title: 'Code',
      type: 'code',
      description: 'Code with syntax highlighting',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'Python', value: 'python'},
          {title: 'Shell', value: 'shell'},
          {title: 'SQL', value: 'sql'},
          {title: 'YAML', value: 'yaml'},
          {title: 'XML', value: 'xml'},
        ],
        withFilename: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Tags to categorize this code',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'API', value: 'api'},
          {title: 'Database', value: 'database'},
          {title: 'Configuration', value: 'config'},
          {title: 'Utilities', value: 'utilities'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      description: 'Category for this code',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      description: 'codeContent.code',
    },
    prepare(selection) {
      const {title, subtitle, description} = selection
      return {
        title: title || 'Code Example',
        subtitle: subtitle || '',
        description: description ? `${description.substring(0, 50)}...` : '',
      }
    },
  },
})
