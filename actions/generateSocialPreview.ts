import {DocumentActionComponent} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const generateSocialPreviewAction: DocumentActionComponent = (props) => {
  const {id, type, published} = props

  // Only show for published posts with cover images
  if (type !== 'post' || !published) {
    return null
  }

  return {
    label: 'Generate Social Preview',
    icon: ImageIcon,
    onHandle: async () => {
      const {createClient} = await import('@sanity/client')
      const client = createClient({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'w486ji4p',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
        apiVersion: '2025-01-15',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
      })

      try {
        // Fetch the post with cover image
        const post = await client.fetch(
          `*[_id == $id][0]{
            title,
            excerpt,
            coverImage,
            author->{firstName, lastName}
          }`,
          {id},
        )

        if (!post) {
          throw new Error('Post not found')
        }

        if (!post.coverImage) {
          alert('This post needs a cover image to generate a social preview.')
          return
        }

        // In a real implementation, you would:
        // 1. Generate Open Graph images
        // 2. Create Twitter card previews
        // 3. Generate LinkedIn post previews
        // For now, show preview data
        const previewData = {
          title: post.title,
          description: post.excerpt || 'No excerpt provided',
          author: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown',
          image: post.coverImage,
        }

        console.log('Social Preview Data:', previewData)
        alert(
          `Social preview generated!\n\nTitle: ${previewData.title}\nAuthor: ${previewData.author}\n\nCheck console for full data.`,
        )
      } catch (error) {
        console.error('Error generating preview:', error)
        alert('Failed to generate social preview. Please try again.')
      }
    },
  }
}
