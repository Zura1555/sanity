import React, {useEffect, useRef} from 'react'
import {useFormValue, useDocumentOperation, type InputProps} from 'sanity'
import {Card, Text} from '@sanity/ui'
import {portableTextToMarkdown, markdownToPortableText} from '../lib/contentConversion'

export function ContentTypeConverterInput(props: InputProps) {
  const {value, onChange, renderDefault} = props

  // Get current content values
  const content = useFormValue(['content']) as any[] | undefined
  const markdownContent = useFormValue(['markdownContent']) as string | undefined

  // Get document operations for patching
  // Strip 'drafts.' prefix if present since useDocumentOperation doesn't accept draft IDs
  const rawDocumentId = useFormValue(['_id']) as string | undefined
  const documentId = rawDocumentId?.replace(/^drafts\./, '') || ''
  const documentType = useFormValue(['_type']) as string | undefined
  const {patch}: any = useDocumentOperation(documentId, documentType || '')

  // Track previous value
  const prevValueRef = useRef(value)
  const isConvertingRef = useRef(false)

  useEffect(() => {
    // Skip if no change or initial load
    if (prevValueRef.current === value) {
      return
    }

    // Skip if already converting
    if (isConvertingRef.current) {
      return
    }

    const prevType = prevValueRef.current
    prevValueRef.current = value

    // Perform conversion
    const performConversion = async () => {
      isConvertingRef.current = true

      try {
        if (prevType === 'portableText' && value === 'markdown') {
          // Convert Portable Text to Markdown
          const markdown = portableTextToMarkdown(content || [])
          if (markdown) {
            patch.execute([{set: {markdownContent: markdown}}])
          }
        } else if (prevType === 'markdown' && value === 'portableText') {
          // Convert Markdown to Portable Text
          const blocks = await markdownToPortableText(markdownContent || '')
          if (blocks && blocks.length > 0) {
            patch.execute([{set: {content: blocks}}])
          }
        }
      } catch (error) {
        console.error('Error converting content:', error)
      } finally {
        isConvertingRef.current = false
      }
    }

    performConversion()
  }, [value, content, markdownContent, patch])

  return (
    <Card>
      {renderDefault(props)}
      <Card padding={3} marginTop={3} tone="primary">
        <Text size={1}>
          Switching content types will automatically convert your content between Portable Text and
          Markdown.
        </Text>
      </Card>
    </Card>
  )
}
