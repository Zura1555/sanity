import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'w486ji4p',
  dataset: 'production',
  apiVersion: '2024-10-18',
  useCdn: false,
})
