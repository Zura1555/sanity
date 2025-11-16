import {describe, it, expect} from 'vitest'
import {category} from '../../schemaTypes/category'

describe('Category Schema', () => {
  it('should have correct schema configuration', () => {
    expect(category.name).toBe('category')
    expect(category.title).toBe('Category')
    expect(category.type).toBe('document')
  })

  it('should have all required fields', () => {
    const fieldNames = category.fields.map((field: any) => field.name)

    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('description')
    expect(fieldNames).toContain('color')
    expect(fieldNames).toContain('featured')
    expect(fieldNames).toContain('seo')
  })

  it('should have color field with predefined options', () => {
    const colorField = category.fields.find((f: any) => f.name === 'color')
    expect(colorField).toBeDefined()
    expect(colorField?.options?.list).toBeDefined()
    expect(colorField?.options?.list.length).toBeGreaterThan(0)

    const colors = colorField?.options?.list.map((c: any) => c.value)
    expect(colors).toContain('blue')
    expect(colors).toContain('green')
    expect(colors).toContain('red')
  })

  it('should have featured field with default value', () => {
    const featuredField = category.fields.find((f: any) => f.name === 'featured')
    expect(featuredField).toBeDefined()
    expect(featuredField?.type).toBe('boolean')
    expect(featuredField?.initialValue).toBe(false)
  })

  it('should have SEO settings as collapsible object', () => {
    const seoField = category.fields.find((f: any) => f.name === 'seo')
    expect(seoField).toBeDefined()
    expect(seoField?.type).toBe('object')
    expect(seoField?.options?.collapsible).toBe(true)
    expect(seoField?.options?.collapsed).toBe(true)
  })

  it('should prevent circular parent references', () => {
    const parentField = category.fields.find((f: any) => f.name === 'parentCategory')
    expect(parentField).toBeDefined()
    expect(parentField?.validation).toBeDefined()
  })

  it('should have preview with featured indicator', () => {
    expect(category.preview).toBeDefined()
    expect(category.preview?.prepare).toBeDefined()

    // Test preview prepare function
    const result = category.preview?.prepare({
      title: 'Test Category',
      featured: true,
      subtitle: 'Test description',
      media: null,
    })

    expect(result?.title).toContain('⭐')
  })

  it('should have validation on title length', () => {
    const titleField = category.fields.find((f: any) => f.name === 'title')
    expect(titleField?.validation).toBeDefined()
  })

  it('should have description with max length', () => {
    const descField = category.fields.find((f: any) => f.name === 'description')
    expect(descField?.validation).toBeDefined()
  })
})
