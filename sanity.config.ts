import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {icons} from '@sanity/icons'



export default defineConfig({
  name: 'default',
  title: 'Zura',

  projectId: 'w486ji4p',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .icon(icons.ArticleIcon)
              .child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('Authors')
              .icon(icons.UserIcon)
              .child(S.documentTypeList('person').title('Authors')),
            S.listItem()
              .title('Categories')
              .icon(icons.TagsIcon)
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Asset')
              .icon(icons.ImageIcon)
              .child(
                S.documentTypeList('asset')
                  .title('🖼️ Images')
                  .filter('_type == "asset"')
                  .defaultOrdering([
                    {field: 'title', direction: 'asc'}, // Alphabetical
                  ])
              ),
            S.listItem()
              .title('Settings')
              .icon(icons.CogIcon)
              .child(S.documentTypeList('settings').title('Settings')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
