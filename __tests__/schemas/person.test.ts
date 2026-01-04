import {describe, it, expect} from 'vitest'
import {person} from '../../schemaTypes/person'

describe('Person Schema', () => {
  it('should have correct schema configuration', () => {
    expect(person.name).toBe('person')
    expect(person.title).toBe('Person')
    expect(person.type).toBe('document')
  })

  it('should have required name fields', () => {
    const fieldNames = person.fields.map((field) => field.name)

    expect(fieldNames).toContain('firstName')
    expect(fieldNames).toContain('lastName')
    expect(fieldNames).toContain('picture')
  })

  it('should require firstName and lastName', () => {
    const firstNameField = person.fields.find((f) => f.name === 'firstName')
    expect(firstNameField?.validation).toBeDefined()

    const lastNameField = person.fields.find((f) => f.name === 'lastName')
    expect(lastNameField?.validation).toBeDefined()
  })

  it('should have picture with hotspot', () => {
    const pictureField = person.fields.find((f) => f.name === 'picture')
    expect(pictureField?.type).toBe('image')
    // @ts-expect-error - options are generic
    expect(pictureField?.options?.hotspot).toBe(true)
  })

  it('should require alt text for picture', () => {
    const pictureField = person.fields.find((f) => f.name === 'picture')
    // @ts-expect-error - fields property exists on image type
    const altField = pictureField?.fields?.find((f) => f.name === 'alt')

    expect(altField).toBeDefined()
    expect(altField?.validation).toBeDefined()
  })

  it('should have preview combining first and last name', () => {
    expect(person.preview).toBeDefined()
    expect(person.preview?.prepare).toBeDefined()

    const result = person.preview?.prepare?.({
      firstName: 'John',
      lastName: 'Doe',
      media: null,
    })

    expect(result?.title).toBe('John Doe')
    expect(result?.subtitle).toBe('Author')
  })

  it('should have helpful descriptions', () => {
    const firstNameField = person.fields.find((f) => f.name === 'firstName')
    expect(firstNameField?.description).toBeDefined()
    expect(firstNameField?.description).toBeTruthy()
  })
})
