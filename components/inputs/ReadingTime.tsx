import {Box, Card, Flex, Text} from '@sanity/ui'
import {useFormValue} from 'sanity'
import {ClockIcon} from '@sanity/icons'

/**
 * Reading Time Component
 * Calculates and displays estimated reading time based on content
 */
export const ReadingTime = () => {
  const content = useFormValue(['content']) as any[] | undefined
  const markdownContent = useFormValue(['markdownContent']) as string | undefined

  // Calculate word count
  const getWordCount = (): number => {
    let text = ''

    // Extract text from block content
    if (content && Array.isArray(content)) {
      content.forEach((block) => {
        if (block._type === 'block' && block.children) {
          block.children.forEach((child: any) => {
            if (child.text) {
              text += child.text + ' '
            }
          })
        }
      })
    }

    // Extract text from markdown
    if (markdownContent) {
      text += markdownContent
    }

    // Count words
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    return words.length
  }

  const wordCount = getWordCount()
  const readingTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words/minute
  const readingTimeRange = `${Math.max(1, readingTime - 1)}-${readingTime + 1}`

  if (wordCount === 0) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Flex align="center" gap={2}>
          <ClockIcon />
          <Text size={1} muted>
            No content yet. Add content to see reading time.
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Card padding={3} radius={2} tone="positive" border>
      <Flex gap={3} align="center">
        <ClockIcon style={{fontSize: '24px'}} />
        <Box flex={1}>
          <Text size={2} weight="semibold">
            {readingTimeRange} min read
          </Text>
          <Text size={1} muted>
            {wordCount.toLocaleString()} words • ~{readingTime} minutes at 200 WPM
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}
