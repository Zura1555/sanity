import {describe, it, expect} from 'vitest'
import {person} from '../../schemaTypes/person'

describe('Person Schema', () => {
  it('should have correct schema configuration', () => {
    expect(person.name).toBe('person')
    expect(person.title).toBe('Person')
    expect(person.type).toBe('document')
  })

  it('should have required name fields', () => {
    const fieldNames = person.fields.map((field: any) => field.name)

    expect(fieldNames).toContain('firstName')
    expect(fieldNames).toContain('lastName')
    expect(fieldNames).toContain('picture')
  })

  it('should require firstName and lastName', () => {
    const firstNameField = person.fields.find((f: any) => f.name === 'firstName')
    expect(firstNameField?.validation).toBeDefined()

    const lastNameField = person.fields.find((f: any) => f.name === 'lastName')
    expect(lastNameField?.validation).toBeDefined()
  })

  it('should have picture with hotspot', () => {
    const pictureField = person.fields.find((f: any) => f.name === 'picture')
    expect(pictureField?.type).toBe('image')
    expect(pictureField?.options?.hotspot).toBe(true)
  })

  it('should require alt text for picture', () => {
    const pictureField = person.fields.find((f: any) => f.name === 'picture')
    const altField = pictureField?.fields?.find((f: any) => f.name === 'alt')

    expect(altField).toBeDefined()
    expect(altField?.validation).toBeDefined()
  })

  it('should have preview combining first and last name', () => {
    expect(person.preview).toBeDefined()
    expect(person.preview?.prepare).toBeDefined()

    const result = person.preview?.prepare({
      firstName: 'John',
      lastName: 'Doe',
      media: null,
    })

    expect(result?.title).toBe('John Doe')
    expect(result?.subtitle).toBe('Author')
  })

  it('should have helpful descriptions', () => {
    const firstNameField = person.fields.find((f: any) => f.name === 'firstName')
    expect(firstNameField?.description).toBeDefined()
    expect(firstNameField?.description).toBeTruthy()
  })
})
