# Webhook Configuration Guide

This directory contains webhook configurations for your Sanity Studio.

## Overview

Webhooks allow your Sanity Studio to notify external services when content changes. This is useful for:

- **Static Site Rebuilds**: Automatically rebuild your website when content is published
- **Notifications**: Send alerts to Slack, Discord, or email when content changes
- **Cache Invalidation**: Clear CDN caches when content updates
- **Data Synchronization**: Keep external databases in sync with your Sanity content
- **Analytics**: Track content creation and updates

## Setup Instructions

### 1. Configure Environment Variables

Add your webhook URLs to `.env`:

```bash
# Rebuild triggers
SANITY_WEBHOOK_REBUILD_URL=https://api.netlify.com/build_hooks/YOUR_HOOK_ID
SANITY_WEBHOOK_VERCEL_URL=https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID

# Notifications
SANITY_WEBHOOK_SLACK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SANITY_WEBHOOK_DISCORD_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID

# CDN/Cache
SANITY_WEBHOOK_CDN_URL=https://api.cloudflare.com/client/v4/zones/YOUR_ZONE/purge_cache
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# Analytics
SANITY_WEBHOOK_ANALYTICS_URL=https://api.analytics.example.com/update
```

### 2. Create Webhooks in Sanity Manage

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project → API → Webhooks
3. Click "Create webhook"
4. Configure each webhook with:
   - **Name**: Descriptive name (e.g., "Rebuild Production Site")
   - **URL**: Your webhook endpoint
   - **Dataset**: Choose dataset (usually "production")
   - **Trigger on**: Select when to trigger (create/update/delete)
   - **Filter** (optional): GROQ filter to limit triggers
   - **HTTP Headers** (optional): Custom headers
   - **HTTP Method**: Usually POST
   - **Include drafts**: Usually disabled

### 3. Common Webhook Configurations

#### Netlify Rebuild

```
Name: Rebuild Netlify Site
URL: https://api.netlify.com/build_hooks/YOUR_HOOK_ID
Trigger: Update, Create
Filter: _type in ["post", "category", "settings"]
```

#### Vercel Rebuild

```
Name: Rebuild Vercel Site
URL: https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID/YOUR_TOKEN
Trigger: Update, Create
Filter: _type in ["post", "category", "settings"]
```

#### Slack Notification

```
Name: Slack Post Notifications
URL: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
Trigger: Update
Filter: _type == "post" && publishedAt != @before.publishedAt
Headers: Content-Type: application/json
Payload:
{
  "text": "New post published: {{document.title}}"
}
```

### 4. Testing Webhooks

Using Sanity CLI:

```bash
# List configured webhooks
npx sanity hook list

# Create a webhook (interactive)
npx sanity hook create

# Test a webhook
npx sanity hook attempt <webhook-id> <document-id>
```

### 5. Monitoring Webhooks

In Sanity Manage → Webhooks:

- View delivery logs
- Check failed deliveries
- Retry failed webhooks
- Disable/enable webhooks

## Webhook Filters (GROQ)

Use GROQ filters to control when webhooks trigger:

```groq
# Only published posts
_type == "post" && publishedAt != null

# Posts being published (status change)
_type == "post" && publishedAt != @before.publishedAt

# Specific categories
_type == "post" && references($categoryId)

# Multiple document types
_type in ["post", "category", "person"]

# Exclude drafts
!(_id in path("drafts.**"))
```

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS webhook URLs
2. **Verify Signatures**: Validate webhook signatures when possible
3. **Environment Variables**: Never hardcode webhook URLs
4. **Least Privilege**: Only trigger on necessary events
5. **Rate Limiting**: Implement rate limiting on receiving end
6. **Monitoring**: Set up alerts for failed webhooks

## Common Integration Examples

### Cloudflare Cache Purge

```javascript
// Example endpoint receiving webhook
app.post('/webhook/purge-cache', async (req, res) => {
  const {document} = req.body

  await fetch('https://api.cloudflare.com/client/v4/zones/YOUR_ZONE/purge_cache', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: [`https://yoursite.com/posts/${document.slug.current}`, `https://yoursite.com/`],
    }),
  })

  res.status(200).json({success: true})
})
```

### Send Email Notification

```javascript
// Example email notification
app.post('/webhook/email-notify', async (req, res) => {
  const {document, action} = req.body

  if (action === 'publish') {
    await sendEmail({
      to: 'editors@yoursite.com',
      subject: `New post published: ${document.title}`,
      body: `${document.title} has been published at ${document.publishedAt}`,
    })
  }

  res.status(200).json({success: true})
})
```

## Troubleshooting

**Webhook not triggering:**

- Check filter syntax in Sanity Manage
- Verify dataset configuration
- Ensure document matches trigger conditions

**Failed deliveries:**

- Check webhook URL is accessible
- Verify endpoint accepts POST requests
- Check for SSL certificate issues
- Review server logs for errors

**Too many triggers:**

- Add more specific GROQ filters
- Use draft exclusion: `!(_id in path("drafts.**"))`
- Consider debouncing on receiving end

## Resources

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [GROQ Filter Reference](https://www.sanity.io/docs/query-cheat-sheet)
- [Webhook Best Practices](https://www.sanity.io/guides/webhooks)
