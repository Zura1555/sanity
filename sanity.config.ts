import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {templates} from './templates'
import {documentActions} from './actions'
import {media} from 'sanity-plugin-media'
import {codeInput} from '@sanity/code-input'
import {markdownSchema} from 'sanity-plugin-markdown'
import {cloudinaryAssetSourcePlugin, cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import seofields from 'sanity-plugin-seofields'
import {
  DocumentsIcon,
  DocumentIcon,
  TagsIcon,
  ImagesIcon,
  ImageIcon,
  UsersIcon,
  UserIcon,
  CogIcon,
} from '@sanity/icons'

export default defineConfig({
  name: 'default',
  title: 'Zura',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'w486ji4p',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    media({
      creditLine: {
        enabled: true,
        excludeSources: ['unsplash'],
      },
      maximumUploadSize: 10000000,
    }),
    codeInput(),
    markdownSchema(),
    cloudinaryAssetSourcePlugin(),
    cloudinarySchemaPlugin(),
    seofields(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Content Section
            S.listItem()
              .title('📝 Content')
              .icon(DocumentsIcon)
              .child(
                S.list()
                  .title('Content')
                  .items([
                    S.listItem()
                      .title('Posts')
                      .icon(DocumentIcon)
                      .child(S.documentTypeList('post').title('All Posts')),
                    S.listItem()
                      .title('Categories')
                      .icon(TagsIcon)
                      .child(S.documentTypeList('category').title('All Categories')),
                  ]),
              ),
            S.divider(),
            // Media Section
            S.listItem()
              .title('🎨 Media')
              .icon(ImagesIcon)
              .child(
                S.list()
                  .title('Media')
                  .items([
                    S.listItem()
                      .title('Assets')
                      .icon(ImageIcon)
                      .child(
                        S.documentTypeList('asset')
                          .title('All Assets')
                          .filter('_type == "asset"')
                          .defaultOrdering([{field: 'title', direction: 'asc'}]),
                      ),
                  ]),
              ),
            S.divider(),
            // People Section
            S.listItem()
              .title('👥 People')
              .icon(UsersIcon)
              .child(
                S.list()
                  .title('People')
                  .items([
                    S.listItem()
                      .title('Authors')
                      .icon(UserIcon)
                      .child(S.documentTypeList('person').title('All Authors')),
                  ]),
              ),
            S.divider(),
            // Configuration Section
            S.listItem()
              .title('⚙️ Configuration')
              .icon(CogIcon)
              .child(
                S.list()
                  .title('Configuration')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .icon(CogIcon)
                      .child(S.documentTypeList('settings').title('Settings')),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates,
  },

  document: {
    actions: documentActions,
  },
})
