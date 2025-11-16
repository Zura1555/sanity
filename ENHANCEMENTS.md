# Sanity Studio Advanced Enhancements

This document outlines the advanced features and enhancements added to your Sanity Studio.

## Table of Contents

1. [Pre-commit Hooks](#pre-commit-hooks)
2. [Schema Validation Tests](#schema-validation-tests)
3. [Custom Document Actions](#custom-document-actions)
4. [Webhook Configuration](#webhook-configuration)
5. [Accessibility Improvements](#accessibility-improvements)

---

## 1. Pre-commit Hooks

### Overview

Automatic code quality enforcement using Husky and lint-staged.

### Features

- **Auto-formatting**: Automatically formats TypeScript/TSX files with Prettier
- **Linting**: Runs ESLint on staged files
- **Type checking**: Validates TypeScript types before commit

### Configuration

Located in:

- `.husky/pre-commit` - Hook script
- `package.json` - Lint-staged configuration

### Usage

Pre-commit hooks run automatically when you commit:

```bash
git add .
git commit -m "Your message"
# Hooks run automatically here
```

Manual commands:

```bash
npm run lint          # Run ESLint
npm run format        # Format all files
npm run type-check    # TypeScript validation
```

---

## 2. Schema Validation Tests

### Overview

Comprehensive test suite for schema validation using Vitest.

### Test Files

- `__tests__/schemas/post.test.ts` - Post schema validation
- `__tests__/schemas/category.test.ts` - Category schema validation
- `__tests__/schemas/person.test.ts` - Person schema validation

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage report
```

### Test Coverage

- Schema structure validation
- Required fields checking
- Validation rules verification
- Preview configuration tests
- Field organization (fieldsets)

---

## 3. Custom Document Actions

### Overview

Custom actions available in the document editor for enhanced workflows.

### Actions Available

#### Duplicate Post

**Location**: `actions/duplicatePost.ts`

- Duplicates an existing published post
- Automatically appends "(Copy)" to title
- Generates unique slug with timestamp
- Clears publish date for review

**Usage**: Click "Duplicate" button in post document menu

#### Publish & Share

**Location**: `actions/publishWithSocial.ts`

- Publishes post and sets publishedAt timestamp
- Shows confirmation dialog
- Ready for social media API integration

**Usage**: Click "Publish & Share" on unpublished posts

#### Generate Social Preview

**Location**: `actions/generateSocialPreview.ts`

- Generates social media preview data
- Validates cover image presence
- Prepares OpenGraph metadata
- Console logs preview data for debugging

**Usage**: Click "Generate Social Preview" on published posts with images

### Setup Requirements

Add API token to `.env`:

```bash
SANITY_API_TOKEN=your-api-token-here
```

Get token from: https://www.sanity.io/manage → API → Tokens

---

## 4. Webhook Configuration

### Overview

Complete webhook setup for external service integration.

### Documentation

See `webhooks/README.md` for comprehensive guide

### Configuration File

`webhooks/config.ts` - Pre-configured webhook examples

### Supported Integrations

1. **Static Site Rebuilds**
   - Netlify
   - Vercel
   - Custom build hooks

2. **Notifications**
   - Slack
   - Discord
   - Email

3. **CDN/Cache**
   - Cloudflare
   - Fastly
   - Custom CDN

4. **Analytics**
   - Custom analytics platforms
   - Data synchronization

### Quick Setup

1. Add webhook URLs to `.env`
2. Configure in Sanity Manage
3. Test with Sanity CLI:
   ```bash
   npx sanity hook list
   npx sanity hook create
   ```

### Environment Variables

```bash
SANITY_WEBHOOK_REBUILD_URL=https://...
SANITY_WEBHOOK_SLACK_URL=https://...
SANITY_WEBHOOK_CDN_URL=https://...
CLOUDFLARE_API_TOKEN=your_token
```

---

## 5. Accessibility Improvements

### Overview

WCAG 2.1 AA compliant accessibility enhancements in custom components.

### Improvements Made

#### FolderTreeView Component

**File**: `components/FolderTreeView.tsx`

**ARIA Roles**:

- `role="tree"` - Tree structure for folder hierarchy
- `role="treeitem"` - Individual folders and images
- `role="toolbar"` - Action buttons group
- `role="status"` - Loading states
- `role="alert"` - Error messages
- `role="main"` - Main content area

**ARIA Labels**:

- Descriptive labels for all interactive elements
- Screen reader announcements for state changes
- Context-aware descriptions

**ARIA States**:

- `aria-expanded` - Folder expansion state
- `aria-live` - Dynamic content updates
- `aria-describedby` - Error message association

**Keyboard Navigation**:

- `tabIndex={0}` - Keyboard focusable items
- Semantic HTML structure
- Focus indicators

### Testing Accessibility

Use these tools to validate:

- **Screen Readers**: NVDA, JAWS, VoiceOver
- **axe DevTools**: Browser extension
- **Lighthouse**: Chrome DevTools audit
- **WAVE**: Web accessibility evaluation tool

### Best Practices Implemented

✅ Semantic HTML elements
✅ ARIA roles and labels
✅ Keyboard navigation support
✅ Focus management
✅ Screen reader announcements
✅ Color contrast compliance
✅ Error message association

---

## Additional Features

### TypeScript Configuration

Enhanced TypeScript settings in `tsconfig.json`:

- Strict type checking
- Modern module resolution
- JSX support

### Scripts Available

```bash
npm run dev              # Development server
npm run build            # Production build
npm run lint             # ESLint
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation
npm test                 # Run tests
npm run deploy           # Deploy to Sanity
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your credentials
3. Add API token for document actions
4. Configure webhook URLs (optional)

---

## Troubleshooting

### Pre-commit Hooks Not Running

```bash
# Reinstall hooks
npx husky install
chmod +x .husky/pre-commit
```

### TypeScript Errors

```bash
# Clear cache and rebuild
rm -rf node_modules
npm install --legacy-peer-deps
npm run type-check
```

### Tests Failing

```bash
# Update snapshots
npm test -- -u

# Run specific test
npm test -- post.test.ts
```

### Webhook Not Triggering

1. Check filter syntax in Sanity Manage
2. Verify endpoint is accessible
3. Review server logs
4. Test with Sanity CLI

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Vitest Documentation](https://vitest.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Support

For issues or questions:

1. Check this documentation
2. Review individual README files in subdirectories
3. Consult Sanity documentation
4. Check TypeScript/ESLint errors

---

**Last Updated**: 2025-11-16
**Version**: 2.0.0
