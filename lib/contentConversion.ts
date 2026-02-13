import {htmlToBlocks} from '@portabletext/block-tools'
import TurndownService from 'turndown'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import {toHTML} from '@portabletext/to-html'
import type {PortableTextBlock} from '@portabletext/types'

// Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})

// Custom rules for better Markdown output
turndownService.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: (content: string) => `~~${content}~~`,
})

turndownService.addRule('underline', {
  filter: (node: HTMLElement) =>
    node.nodeName === 'SPAN' && node.style.textDecoration === 'underline',
  replacement: (content: string) => `<u>${content}</u>`,
})

// Type for Portable Text blocks
interface PTBlock {
  _type: string
  _key?: string
  style?: string
  listItem?: string
  level?: number
  children?: PTChild[]
  markDefs?: PTMarkDef[]
  href?: string
  [key: string]: unknown
}

interface PTChild {
  _type: string
  text?: string
  marks?: string[]
  [key: string]: unknown
}

interface PTMarkDef {
  _key: string
  _type: string
  href?: string
  [key: string]: unknown
}

// Custom components for toHTML - using any to bypass strict typing
const components: any = {
  block: {
    normal: ({children}: {children: string}) => `<p>${children}</p>`,
    blockquote: ({children}: {children: string}) => `<blockquote>${children}</blockquote>`,
    h1: ({children}: {children: string}) => `<h1>${children}</h1>`,
    h2: ({children}: {children: string}) => `<h2>${children}</h2>`,
    h3: ({children}: {children: string}) => `<h3>${children}</h3>`,
    h4: ({children}: {children: string}) => `<h4>${children}</h4>`,
    h5: ({children}: {children: string}) => `<h5>${children}</h5>`,
    h6: ({children}: {children: string}) => `<h6>${children}</h6>`,
  },
  list: {
    bullet: ({children}: {children: string}) => `<ul>${children}</ul>`,
    number: ({children}: {children: string}) => `<ol>${children}</ol>`,
  },
  listItem: {
    bullet: ({children}: {children: string}) => `<li>${children}</li>`,
    number: ({children}: {children: string}) => `<li>${children}</li>`,
  },
  marks: {
    strong: ({children}: {children: string}) => `<strong>${children}</strong>`,
    em: ({children}: {children: string}) => `<em>${children}</em>`,
    code: ({children}: {children: string}) => `<code>${children}</code>`,
    underline: ({children}: {children: string}) => `<u>${children}</u>`,
    'strike-through': ({children}: {children: string}) => `<del>${children}</del>`,
    link: ({children, value}: {children: string; value?: {href?: string}}) => 
      `<a href="${value?.href || ''}">${children}</a>`,
  },
  types: {},
}

/**
 * Convert Portable Text blocks to Markdown
 */
export function portableTextToMarkdown(blocks: PTBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  try {
    // Convert Portable Text to HTML first
    const html = toHTML(blocks as PortableTextBlock[], {components})

    // Convert HTML to Markdown
    return turndownService.turndown(html)
  } catch (error) {
    console.error('Error converting Portable Text to Markdown:', error)
    return ''
  }
}

/**
 * Convert Markdown to Portable Text blocks
 */
export async function markdownToPortableText(markdown: string): Promise<any[]> {
  if (!markdown || markdown.trim() === '') {
    return []
  }

  try {
    // Convert Markdown to HTML using remark
    const result = await unified()
      .use(remarkParse)
      .use(remarkHtml, {sanitize: false})
      .process(markdown)

    const html = String(result)

    // Default block content schema type for conversion
    const blockContentType: any = {
      type: 'array',
      name: 'blockContent',
      of: [
        {
          type: 'block',
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
          lists: [
            {title: 'Bulleted', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
          },
        },
      ],
    }

    // Convert HTML to Portable Text blocks
    const blocks = htmlToBlocks(html, blockContentType, {
      parseHtml: (htmlString: string) => {
        const parser = new DOMParser()
        return parser.parseFromString(htmlString, 'text/html')
      },
    })

    return blocks
  } catch (error) {
    console.error('Error converting Markdown to Portable Text:', error)
    return []
  }
}
