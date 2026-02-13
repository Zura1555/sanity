import {definePlugin} from 'sanity'
import {useEffect, useRef} from 'react'
import {useDocumentOperation, useFormValue} from 'sanity'
import {portableTextToMarkdown, markdownToPortableText} from '../../lib/contentConversion'

/**
 * Plugin that automatically converts content between Portable Text and Markdown
 * when the contentType field changes
 */
export const contentTypeConverter = definePlugin({
  name: 'content-type-converter',
  document: {
    // Use the components API to inject our converter
    components: {
      input: (props: any) => {
        // Get the current document ID and type
        const documentId = props.document?._id
        const documentType = props.schemaType?.name
        
        // Only apply to post documents
        if (documentType !== 'post') {
          return props.renderDefault(props)
        }

        return (<ContentTypeConverter {...props} />)
      },
    },
  },
})

/**
 * Component that watches for contentType changes and performs conversion
 */
function ContentTypeConverter(props: any) {
  const {documentId, schemaType} = props
  const {patch}: any = useDocumentOperation(documentId, schemaType?.name)
  
  // Get current values
  const contentType = useFormValue(['contentType']) as string | undefined
  const content = useFormValue(['content']) as any[] | undefined
  const markdownContent = useFormValue(['markdownContent']) as string | undefined
  
  // Track previous contentType to detect changes
  const prevContentTypeRef = useRef<string | undefined>(contentType)
  const isConvertingRef = useRef(false)
  
  useEffect(() => {
    // Skip if no change or initial load
    if (prevContentTypeRef.current === contentType) {
      return
    }
    
    // Skip if already converting
    if (isConvertingRef.current) {
      return
    }
    
    const prevType = prevContentTypeRef.current
    prevContentTypeRef.current = contentType
    
    // Perform conversion
    const performConversion = async () => {
      isConvertingRef.current = true
      
      try {
        if (prevType === 'portableText' && contentType === 'markdown') {
          // Convert Portable Text to Markdown
          const markdown = portableTextToMarkdown(content || [])
          patch.execute([
            {set: {markdownContent: markdown}}
          ])
        } else if (prevType === 'markdown' && contentType === 'portableText') {
          // Convert Markdown to Portable Text
          const blocks = await markdownToPortableText(markdownContent || '')
          patch.execute([
            {set: {content: blocks}}
          ])
        }
      } catch (error) {
        console.error('Error converting content:', error)
      } finally {
        isConvertingRef.current = false
      }
    }
    
    performConversion()
  }, [contentType, content, markdownContent, patch])
  
  return props.renderDefault(props)
}
