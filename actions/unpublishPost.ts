import {DocumentActionComponent, useDocumentOperation} from 'sanity'
import {UndoIcon} from '@sanity/icons'

export const UnpublishPostAction: DocumentActionComponent = (props) => {
  const {type, id, draft, published} = props

  // Hooks must be called unconditionally before any early returns
  const operation = useDocumentOperation(id, type)

  // Only show for published posts
  if (type !== 'post' || !published) {
    return null
  }

  const handleUnpublish = () => {
    // Unpublish the document - moves it back to draft
    if (operation.unpublish) {
      operation.unpublish.execute()
    }
    props.onComplete()
  }

  return {
    label: 'Unpublish',
    icon: UndoIcon,
    tone: 'caution',
    disabled: operation.unpublish?.disabled,
    dialog: !operation.unpublish?.disabled
      ? {
          type: 'confirm',
          onConfirm: handleUnpublish,
          onCancel: props.onComplete,
          message: 'Are you sure you want to unpublish this post? It will be moved back to draft status.',
        }
      : null,
  }
}
