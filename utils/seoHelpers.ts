/**
 * SEO Helper Utilities
 * Functions to generate SEO meta tags and structured data
 */

export interface SeoData {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  keywords?: string[]
  socialImage?: {
    url: string
    width?: number
    height?: number
    alt?: string
  }
  noIndex?: boolean
  noFollow?: boolean
}

export interface StructuredDataConfig {
  schemaType: string
  articleSection?: string
  wordCount?: number
  customJson?: string
}

/**
 * Generate meta title with fallback
 */
export function generateMetaTitle(
  seoTitle: string | undefined,
  postTitle: string,
  siteTitle: string = 'Your Site',
): string {
  const title = seoTitle || postTitle
  return `${title} | ${siteTitle}`
}

/**
 * Generate meta description with fallback
 */
export function generateMetaDescription(
  seoDescription: string | undefined,
  excerpt: string | undefined,
  fallback: string = 'Read more on our blog',
): string {
  return seoDescription || excerpt || fallback
}

/**
 * Validate SEO field lengths
 */
export function validateSeoLengths(data: SeoData): {
  title: {valid: boolean; length: number; message: string}
  description: {valid: boolean; length: number; message: string}
} {
  const titleLength = data.metaTitle?.length || 0
  const descLength = data.metaDescription?.length || 0

  return {
    title: {
      valid: titleLength >= 30 && titleLength <= 60,
      length: titleLength,
      message:
        titleLength > 60
          ? 'Title too long (will be truncated)'
          : titleLength < 30
            ? 'Title too short'
            : 'Title length is optimal',
    },
    description: {
      valid: descLength >= 50 && descLength <= 160,
      length: descLength,
      message:
        descLength > 160
          ? 'Description too long (will be truncated)'
          : descLength < 50
            ? 'Description too short'
            : 'Description length is optimal',
    },
  }
}

/**
 * Generate structured data (JSON-LD) for blog posts
 */
export function generateBlogPostingSchema(data: {
  title: string
  description: string
  author: {firstName: string; lastName: string}
  publishedAt: string
  modifiedAt?: string
  imageUrl?: string
  url: string
  keywords?: string[]
  articleSection?: string
  wordCount?: number
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    image: data.imageUrl,
    datePublished: data.publishedAt,
    dateModified: data.modifiedAt || data.publishedAt,
    author: {
      '@type': 'Person',
      name: `${data.author.firstName} ${data.author.lastName}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Organization',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yoursite.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection,
    wordCount: data.wordCount,
  }
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(data: {
  title: string
  description: string
  author: {firstName: string; lastName: string}
  publishedAt: string
  modifiedAt?: string
  imageUrl?: string
  url: string
  keywords?: string[]
  articleSection?: string
  wordCount?: number
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.imageUrl,
    datePublished: data.publishedAt,
    dateModified: data.modifiedAt || data.publishedAt,
    author: {
      '@type': 'Person',
      name: `${data.author.firstName} ${data.author.lastName}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Organization',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yoursite.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection,
    wordCount: data.wordCount,
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: {name: string; url: string}[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Extract text from Portable Text blocks
 */
export function extractTextFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join(' ')
      }
      return ''
    })
    .join('\n')
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(data: {
  title: string
  description: string
  imageUrl?: string
  url: string
  type?: string
  siteName?: string
}): Record<string, string> {
  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.imageUrl || '',
    'og:url': data.url,
    'og:type': data.type || 'article',
    'og:site_name': data.siteName || 'Your Site',
  }
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(data: {
  title: string
  description: string
  imageUrl?: string
  card?: 'summary' | 'summary_large_image'
}): Record<string, string> {
  return {
    'twitter:card': data.card || 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.imageUrl || '',
  }
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate canonical URL
 */
export function validateCanonicalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
