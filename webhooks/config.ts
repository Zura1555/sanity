/**
 * Webhook Configuration for Sanity Studio
 *
 * This file defines webhook endpoints that can be triggered when documents change.
 * To activate webhooks, you need to configure them in your Sanity project settings:
 * https://www.sanity.io/manage/project/{projectId}/api/webhooks
 *
 * Common webhook use cases:
 * - Trigger static site rebuilds (Netlify, Vercel, etc.)
 * - Send notifications (Slack, Discord, Email)
 * - Update external services (CRM, Analytics, etc.)
 * - Clear CDN caches
 * - Sync data to other databases
 */

export interface WebhookConfig {
  name: string
  url: string
  description: string
  dataset: string
  trigger: 'create' | 'update' | 'delete' | '*'
  filter?: string
  headers?: Record<string, string>
}

/**
 * Example webhook configurations
 * Replace these with your actual webhook URLs
 */
export const webhookConfigs: WebhookConfig[] = [
  {
    name: 'Rebuild Production Site',
    url:
      process.env.SANITY_WEBHOOK_REBUILD_URL || 'https://api.netlify.com/build_hooks/YOUR_HOOK_ID',
    description: 'Trigger a rebuild of the production website when content changes',
    dataset: 'production',
    trigger: '*', // Trigger on any change
    filter: '_type in ["post", "category", "person", "settings"]',
  },
  {
    name: 'Slack Notifications',
    url:
      process.env.SANITY_WEBHOOK_SLACK_URL || 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
    description: 'Send notifications to Slack when posts are published',
    dataset: 'production',
    trigger: 'update',
    filter: '_type == "post" && publishedAt != @before.publishedAt',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  {
    name: 'Clear CDN Cache',
    url:
      process.env.SANITY_WEBHOOK_CDN_URL ||
      'https://api.cloudflare.com/client/v4/zones/YOUR_ZONE/purge_cache',
    description: 'Clear CDN cache when content is updated',
    dataset: 'production',
    trigger: 'update',
    filter: '_type == "post" && publishedAt != null',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN || 'YOUR_TOKEN'}`,
      'Content-Type': 'application/json',
    },
  },
  {
    name: 'Analytics Update',
    url: process.env.SANITY_WEBHOOK_ANALYTICS_URL || 'https://api.analytics.example.com/update',
    description: 'Update analytics when new posts are created',
    dataset: 'production',
    trigger: 'create',
    filter: '_type == "post"',
  },
]

/**
 * Webhook payload transformer
 * Customize the payload sent to webhook endpoints
 */
export function transformWebhookPayload(document: any, action: string) {
  return {
    action,
    document: {
      _id: document._id,
      _type: document._type,
      _createdAt: document._createdAt,
      _updatedAt: document._updatedAt,
      title: document.title,
      slug: document.slug?.current,
      publishedAt: document.publishedAt,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Setup instructions:
 *
 * 1. Add webhook URLs to your .env file:
 *    SANITY_WEBHOOK_REBUILD_URL=https://...
 *    SANITY_WEBHOOK_SLACK_URL=https://...
 *    SANITY_WEBHOOK_CDN_URL=https://...
 *
 * 2. In Sanity Manage (https://www.sanity.io/manage):
 *    - Navigate to your project → API → Webhooks
 *    - Click "Create webhook"
 *    - Configure with the settings from webhookConfigs above
 *
 * 3. Test webhooks using the Sanity CLI:
 *    npx sanity hook create
 *    npx sanity hook list
 *
 * 4. Monitor webhook deliveries in Sanity Manage:
 *    - View delivery logs
 *    - Check for failed deliveries
 *    - Retry failed webhooks
 */
