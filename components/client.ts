import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'w486ji4p',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2025-01-15',
  useCdn: true, // Enable CDN for better performance with published content
})
