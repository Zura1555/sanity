import {DocumentActionComponent} from 'sanity'
import {ShareIcon} from '@sanity/icons'

export const publishWithSocialAction: DocumentActionComponent = (props) => {
  const {id, type, published} = props

  // Only show for unpublished posts
  if (type !== 'post' || published) {
    return null
  }

  return {
    label: 'Publish & Share',
    icon: ShareIcon,
    tone: 'positive',
    onHandle: async () => {
      // eslint-disable-next-line no-restricted-globals
      const confirmed = confirm(
        'This will publish the post and prepare it for social media sharing. Continue?',
      )

      if (!confirmed) {
        return
      }

      const {createClient} = await import('@sanity/client')
      const client = createClient({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'w486ji4p',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
        apiVersion: '2025-01-15',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
      })

      try {
        // Publish the document
        await client.patch(id).set({publishedAt: new Date().toISOString()}).commit()

        // In a real implementation, you would integrate with social media APIs here
        // For now, we'll just show a success message
        alert(
          'Post published successfully! Social media integration would trigger here in production.',
        )

        // Reload the document to show updated state
        window.location.reload()
      } catch (error) {
        console.error('Error publishing post:', error)
        alert('Failed to publish post. Please try again.')
      }
    },
  }
}
