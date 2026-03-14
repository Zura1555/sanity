import {DocumentActionComponent, useDocumentOperation} from 'sanity'
import {ShareIcon} from '@sanity/icons'

export const PublishWithSocialAction: DocumentActionComponent = (props) => {
  const {id, type, published, onComplete} = props
  const isLiveEdit = Boolean((props as any).schemaType?.liveEdit)
  const operation = useDocumentOperation(id, type)

  // Show for unpublished posts or live-edit posts (which are effectively always published)
  if (type !== 'post' || (!isLiveEdit && published)) {
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
        onComplete()
        return
      }

      try {
        let executed = false

        if (!operation.patch?.disabled) {
          executed = true
          await Promise.resolve(operation.patch.execute([{set: {publishedAt: new Date().toISOString()}}]))
        }

        if (!operation.publish?.disabled) {
          executed = true
          await Promise.resolve(operation.publish.execute())
        }

        if (executed) {
          // In a real implementation, you would integrate with social media APIs here
          // For now, we'll just show a success message
          alert(
            'Post published successfully! Social media integration would trigger here in production.',
          )
        }
        onComplete()
      } catch (error) {
        console.error('Error publishing post:', error)
        alert('Failed to publish post. Please try again.')
        onComplete()
      }
    },
  }
}
