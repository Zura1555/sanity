import {duplicatePostAction} from './duplicatePost'
import {PublishWithSocialAction} from './publishWithSocial'
import {generateSocialPreviewAction} from './generateSocialPreview'
import {UnpublishPostAction} from './unpublishPost'

export const documentActions = (prev: any[], context: any) => {
  const {schemaType} = context

  // Add custom actions for posts
  if (schemaType === 'post') {
    return [
      duplicatePostAction,
      PublishWithSocialAction,
      generateSocialPreviewAction,
      UnpublishPostAction,
      ...prev,
    ]
  }

  return prev
}
