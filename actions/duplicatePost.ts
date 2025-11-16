import {DocumentActionComponent} from 'sanity'
import {CopyIcon} from '@sanity/icons'

export const duplicatePostAction: DocumentActionComponent = (props) => {
  const {id, type, draft, onComplete} = props

  // Only show for published posts
  if (type !== 'post' || draft) {
    return null
  }

  return {
    label: 'Duplicate',
    icon: CopyIcon,
    tone: 'primary',
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
        // Fetch the current document
        const doc = await client.fetch(`*[_id == $id][0]`, {id})

        if (!doc) {
          throw new Error('Document not found')
        }

        // Create a new document with duplicated content
        const {_id, _createdAt, _updatedAt, _rev, slug, ...rest} = doc

        const newDoc = {
          ...rest,
          _type: type,
          title: `${doc.title} (Copy)`,
          slug: {
            _type: 'slug',
            current: `${slug?.current}-copy-${Date.now()}`,
          },
          publishedAt: null, // Clear publish date for copy
        }

        const result = await client.create(newDoc)

        // Show success message and reload to show new document
        alert(`Post duplicated successfully! New ID: ${result._id}`)
        window.location.reload()

        onComplete()
      } catch (error) {
        console.error('Error duplicating post:', error)
        alert('Failed to duplicate post. Please try again.')
      }
    },
  }
}
