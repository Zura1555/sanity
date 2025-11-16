import {Box, Card, Stack, Text} from '@sanity/ui'
import {useFormValue} from 'sanity'

/**
 * SEO Preview Component
 * Shows how the content will appear in Google search results
 */
export const SeoPreview = () => {
  const title = useFormValue(['seo', 'metaTitle']) as string | undefined
  const description = useFormValue(['seo', 'metaDescription']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const postTitle = useFormValue(['title']) as string | undefined

  const displayTitle = title || postTitle || 'Your Page Title'
  const displayDescription = description || 'Add a meta description to see how it appears...'
  const siteUrl = process.env.SANITY_STUDIO_SITE_URL || 'https://yoursite.com'
  const displayUrl = `${siteUrl}/${slug || 'post-slug'}`

  // Character count warnings
  const titleLength = displayTitle.length
  const descLength = displayDescription.length
  const titleWarning = titleLength > 60 ? 'warning' : titleLength > 50 ? 'caution' : 'default'
  const descWarning = descLength > 160 ? 'warning' : descLength > 155 ? 'caution' : 'default'

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text size={1} weight="semibold">
          🔍 Google Search Preview
        </Text>

        {/* Google Search Result Preview */}
        <Box
          padding={3}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Stack space={2}>
            {/* URL */}
            <Text
              size={1}
              style={{
                color: '#5f6368',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
              }}
            >
              {displayUrl}
            </Text>

            {/* Title */}
            <Text
              size={2}
              weight="semibold"
              style={{
                color: '#1a0dab',
                fontFamily: 'Arial, sans-serif',
                fontSize: '20px',
                lineHeight: '1.3',
                cursor: 'pointer',
              }}
            >
              {displayTitle}
            </Text>

            {/* Description */}
            <Text
              size={1}
              style={{
                color: '#4d5156',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.58',
              }}
            >
              {displayDescription}
            </Text>
          </Stack>
        </Box>

        {/* Character Counts */}
        <Stack space={2}>
          <Box>
            <Text size={1} muted>
              Title: {titleLength} characters{' '}
              <span
                style={{
                  color:
                    titleWarning === 'warning'
                      ? '#d32f2f'
                      : titleWarning === 'caution'
                        ? '#f57c00'
                        : '#388e3c',
                }}
              >
                {titleLength > 60
                  ? '(too long, will be truncated)'
                  : titleLength > 50
                    ? '(approaching limit)'
                    : '(optimal)'}
              </span>
            </Text>
          </Box>
          <Box>
            <Text size={1} muted>
              Description: {descLength} characters{' '}
              <span
                style={{
                  color:
                    descWarning === 'warning'
                      ? '#d32f2f'
                      : descWarning === 'caution'
                        ? '#f57c00'
                        : '#388e3c',
                }}
              >
                {descLength > 160
                  ? '(too long, will be truncated)'
                  : descLength > 155
                    ? '(approaching limit)'
                    : descLength < 50
                      ? '(too short)'
                      : '(optimal)'}
              </span>
            </Text>
          </Box>
        </Stack>

        {/* Tips */}
        <Card padding={2} radius={2} tone="caution" border>
          <Text size={1}>
            <strong>SEO Tips:</strong>
            <br />• Title: 50-60 characters for best results
            <br />• Description: 150-160 characters for full display
            <br />• Include target keywords naturally
            <br />• Make it compelling to increase click-through rate
          </Text>
        </Card>
      </Stack>
    </Card>
  )
}
