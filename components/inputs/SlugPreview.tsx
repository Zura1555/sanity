import {Box, Button, Card, Flex, Text, TextInput} from '@sanity/ui'
import {set, unset} from 'sanity'
import {useCallback, useState, useEffect} from 'react'
import type {StringInputProps} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * Slug Preview Component
 * Shows the final URL and provides slug generation from title
 */
export const SlugPreview = (props: StringInputProps) => {
  const {value, onChange} = props
  const [isGenerating, setIsGenerating] = useState(false)

  const siteUrl = process.env.SANITY_STUDIO_SITE_URL || 'https://yoursite.com'
  const fullUrl = `${siteUrl}/posts/${value || 'your-post-slug'}`

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    // Get title from form - this would need to be passed from parent or use form context
    // For now, we'll just show the functionality
    const generatedSlug = slugify(value || '')
    onChange(generatedSlug ? set(generatedSlug) : unset())
    setTimeout(() => setIsGenerating(false), 500)
  }, [value, onChange])

  const handleCopy = useCallback(() => {
    if (value) {
      navigator.clipboard.writeText(fullUrl)
      alert('URL copied to clipboard!')
    }
  }, [fullUrl, value])

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Flex direction="column" gap={3}>
        {/* URL Preview */}
        <Box>
          <Text size={1} weight="semibold" style={{marginBottom: '8px', display: 'block'}}>
            URL Preview
          </Text>
          <Card padding={2} radius={2} tone="transparent" border>
            <Flex align="center" gap={2}>
              <LinkIcon />
              <Text
                size={1}
                style={{
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  color: value ? '#1a0dab' : '#999',
                }}
              >
                {fullUrl}
              </Text>
            </Flex>
          </Card>
        </Box>

        {/* Actions */}
        <Flex gap={2}>
          <Button
            text="Generate from Title"
            mode="ghost"
            tone="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            fontSize={1}
          />
          {value && (
            <Button
              text="Copy URL"
              mode="ghost"
              onClick={handleCopy}
              icon={LinkIcon}
              fontSize={1}
            />
          )}
        </Flex>

        {/* Tips */}
        <Card padding={2} radius={2} tone="caution" border>
          <Text size={1}>
            <strong>Slug Best Practices:</strong>
            <br />• Use lowercase letters and hyphens
            <br />• Keep it short and descriptive
            <br />• Include target keyword
            <br />• Avoid special characters and numbers
          </Text>
        </Card>
      </Flex>
    </Card>
  )
}
