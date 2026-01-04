import {describe, it, expect} from 'vitest'
import {post} from '../../schemaTypes/post'

describe('Post Schema', () => {
  it('should have correct schema name', () => {
    expect(post.name).toBe('post')
    expect(post.title).toBe('Post')
    expect(post.type).toBe('document')
  })

  it('should have all required fields', () => {
    const fieldNames = post.fields.map((field) => field.name)

    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('contentType')
    expect(fieldNames).toContain('content')
    expect(fieldNames).toContain('excerpt')
    expect(fieldNames).toContain('coverImage')
    expect(fieldNames).toContain('author')
    expect(fieldNames).toContain('categories')
    expect(fieldNames).toContain('tags')
  })

  it('should have fieldsets for organization', () => {
    expect(post.fieldsets).toBeDefined()
    expect(post.fieldsets?.length).toBe(3)

    const fieldsetNames = post.fieldsets?.map((fs) => fs.name)
    expect(fieldsetNames).toContain('content')
    expect(fieldsetNames).toContain('media')
    expect(fieldsetNames).toContain('metadata')
  })

  it('should have preview configuration', () => {
    expect(post.preview).toBeDefined()
    expect(post.preview?.select).toBeDefined()
    expect(post.preview?.select).toHaveProperty('title')
    expect(post.preview?.select).toHaveProperty('media')
    expect(post.preview?.prepare).toBeDefined()
  })

  it('should validate required fields', () => {
    const titleField = post.fields.find((f) => f.name === 'title')
    expect(titleField?.validation).toBeDefined()

    const slugField = post.fields.find((f) => f.name === 'slug')
    expect(slugField?.validation).toBeDefined()

    const coverImageField = post.fields.find((f) => f.name === 'coverImage')
    expect(coverImageField?.validation).toBeDefined()
  })

  it('should have excerpt with max length validation', () => {
    const excerptField = post.fields.find((f) => f.name === 'excerpt')
    expect(excerptField).toBeDefined()
    expect(excerptField?.validation).toBeDefined()
  })

  it('should have categories with min/max validation', () => {
    const categoriesField = post.fields.find((f) => f.name === 'categories')
    expect(categoriesField).toBeDefined()
    expect(categoriesField?.type).toBe('array')
    expect(categoriesField?.validation).toBeDefined()
  })
})
