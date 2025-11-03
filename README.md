# Zura - Advanced Sanity Studio

A comprehensive Sanity Studio configuration with advanced plugins for code editing, markdown support, cloud storage, and video management.

![Sanity Studio](https://img.shields.io/badge/Sanity-v4.12.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19.1-blue)

## 🚀 Features

### 🎯 Core Content Types
- **Posts** - Rich blog posts with multiple content formats
- **Authors** - Author profiles with bio and social links
- **Categories** - Content categorization system
- **Settings** - Site configuration and metadata

### 🛠️ Advanced Plugin Ecosystem

#### Code Input Plugin
- **Syntax Highlighting** for 10+ programming languages
- **Real-time Preview** as you type
- **Language Selection** dropdown
- **Filename Support** for code snippets
- **Line Highlighting** by clicking line numbers
- **Supported Languages**: JavaScript, TypeScript, HTML, CSS, JSON, Python, Shell, SQL, YAML, XML

#### Markdown Plugin
- **Live Preview** with instant markdown rendering
- **GitHub Flavored Markdown** support
- **Image Upload** via drag & drop or file selector
- **Rich Toolbar** with formatting shortcuts
- **Custom Image URLs** with Sanity pipeline optimization

#### Cloudinary Plugin
- **Media Library Browser** for browsing Cloudinary assets
- **Advanced Transformations** with real-time preview
- **Video Support** with built-in player
- **CDN Delivery** for global performance
- **Asset Optimization** with automatic compression

#### ImageKit Plugin
- **Professional Video Management** with upload and preview
- **Quality Optimization** with configurable compression
- **Multiple Resolution Support** (720p, 1080p, 2160p)
- **Signed URLs** for private video content
- **Real-time Preview** in Studio interface

### 📁 Enhanced Schema Types

#### Post Content
- **Rich Text Content** with portable text blocks
- **Markdown Content** with live preview
- **Code Examples** with syntax highlighting
- **Featured Images** via Cloudinary
- **Video Content** via ImageKit
- **SEO Metadata** with excerpts and tags

#### Author Profiles
- **Profile Information** with name and bio
- **Rich Bio** with portable text
- **Profile Images** with optimization

#### Site Configuration
- **Markdown Descriptions** for rich site information
- **Logo Management** via Cloudinary
- **Intro Videos** via ImageKit
- **Social Media** metadata and Open Graph images

## 🏗️ Project Structure

```
sanity-studio/
├── components/
│   ├── client.ts                 # Sanity client configuration
│   └── FolderTreeView.tsx        # Custom folder tree component
├── schemaTypes/
│   ├── index.ts                # Schema exports
│   ├── post.ts                 # Post document schema
│   ├── person.ts               # Author document schema
│   ├── category.ts             # Category document schema
│   ├── settings.ts            # Settings document schema
│   ├── blockContent.ts        # Portable text blocks
│   ├── codeExample.ts         # Code example schema
│   ├── link.ts               # Link object schema
│   ├── infoSection.ts         # Info section schema
│   ├── callToAction.ts       # CTA schema
│   └── asset.ts              # Asset document schema
├── static/                    # Static assets
├── .sanity/                  # Sanity configuration
├── sanity.config.ts           # Studio configuration
├── sanity.cli.ts             # CLI configuration
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Sanity CLI** (optional, for command-line operations)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Zura1555/sanity.git
cd sanity
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open Studio**
Navigate to `http://localhost:3333` in your browser

### Production Deployment

1. **Build the studio**
```bash
npm run build
```

2. **Deploy to Sanity**
```bash
npx sanity deploy
```

## ⚙️ Configuration

### Plugin Configuration

#### Code Input
```typescript
// In sanity.config.ts
import {codeInput} from '@sanity/code-input'

plugins: [
  codeInput()
]
```

**Usage in schemas:**
```typescript
defineField({
  name: 'codeExample',
  type: 'code',
  options: {
    language: 'javascript',
    languageAlternatives: [
      {title: 'JavaScript', value: 'javascript'},
      {title: 'TypeScript', value: 'typescript'},
    ],
    withFilename: true,
  }
})
```

#### Markdown
```typescript
// In sanity.config.ts
import {markdownSchema} from 'sanity-plugin-markdown'

plugins: [
  markdownSchema()
]
```

**Usage in schemas:**
```typescript
defineField({
  name: 'markdownContent',
  type: 'markdown',
  description: 'Markdown content with live preview'
})
```

#### Cloudinary
```typescript
// In sanity.config.ts
import {
  cloudinaryAssetSourcePlugin,
  cloudinarySchemaPlugin
} from 'sanity-plugin-cloudinary'

plugins: [
  cloudinaryAssetSourcePlugin(),
  cloudinarySchemaPlugin()
]
```

**Usage in schemas:**
```typescript
defineField({
  name: 'cloudinaryImage',
  type: 'cloudinary.asset',
  description: 'Image from Cloudinary with transformations'
})
```

#### ImageKit
```typescript
// In sanity.config.ts
import {imageKitPlugin} from 'sanity-plugin-imagekit-plugin'

plugins: [
  imageKitPlugin({
    quality: 90,
    transformation: 'auto',
    max_resolution: '1080p'
  })
]
```

**Usage in schemas:**
```typescript
defineField({
  name: 'featuredVideo',
  type: 'imagekit.video',
  description: 'Video hosted on ImageKit'
})
```

### Environment Setup

#### Required API Keys

1. **Sanity Project**
   - Project ID (configured in `sanity.config.ts`)
   - Dataset (production/development)

2. **Cloudinary** (for image/video hosting)
   - Cloudinary Account
   - API Key and Secret
   - Configure via Studio interface

3. **ImageKit** (for video hosting)
   - ImageKit Account
   - API Access Token
   - Configure via Studio interface

## 📖 Content Types Guide

### Posts
The main content type for blog posts and articles.

**Fields:**
- **Title** - Post title
- **Slug** - URL-friendly identifier
- **Content** - Rich text content
- **Markdown Content** - Alternative markdown content
- **Excerpt** - Brief description
- **Cover Image** - Featured image
- **Code Example** - Syntax-highlighted code
- **Cloudinary Image** - Cloudinary-hosted image
- **Featured Video** - ImageKit-hosted video
- **Author** - Post author reference
- **Categories** - Content categorization
- **Tags** - Content tags
- **Publication Date** - Date and time fields

### Authors
Profile information for content authors.

**Fields:**
- **Name** - Author's full name
- **Slug** - URL identifier
- **Picture** - Profile image
- **Bio** - Author biography (rich text)

### Categories
Content categorization system.

**Fields:**
- **Title** - Category name
- **Description** - Category description
- **Slug** - URL identifier

### Settings
Site-wide configuration and metadata.

**Fields:**
- **Title** - Site title
- **Description** - Site description (rich text)
- **Markdown Description** - Alternative markdown description
- **Open Graph Image** - Social media image
- **Cloudinary Logo** - Site logo
- **Intro Video** - Site introduction video

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Deploy to Sanity
npm run deploy

# Deploy GraphQL API
npm run deploy-graphql
```

### TypeScript Configuration

The project uses TypeScript with strict mode enabled:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

### Code Style

The project follows these coding standards:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Strict mode** enabled

## 📚 API Reference

### Custom Types

#### `codeExample`
Document type for code examples with metadata.

**Fields:**
- `title` (string) - Example title
- `description` (text) - Example description
- `codeContent` (code) - The code with syntax highlighting
- `tags` (array of strings) - Tags for categorization
- `category` (string) - Category selection

#### `imagekit.video`
Video field type for ImageKit-hosted videos.

**Features:**
- Upload management
- Quality optimization
- Resolution controls
- Preview functionality

#### `cloudinary.asset`
Asset field type for Cloudinary-hosted media.

**Features:**
- Media library browser
- Transformation preview
- CDN delivery
- Format optimization

### Query Examples

#### Fetch Posts with All Content
```groq
*[_type == "post"]{
  title,
  slug,
  excerpt,
  "coverImageUrl": coverImage.asset->url,
  "cloudinaryImage": cloudinaryImage.asset->url,
  "videoUrl": featuredVideo.asset->url,
  author->{
    name,
    "picture": picture.asset->url
  },
  categories[]->{
    title,
    slug
  },
  _createdAt,
  _updatedAt
}
```

#### Fetch Settings
```groq
*[_type == "settings"][0]{
  title,
  "description": description[0].children[0].text,
  "markdownDescription": markdownDescription,
  "logoUrl": cloudinaryLogo.asset->url,
  "introVideo": introVideo.asset->url
}
```

## 🚀 Deployment

### Sanity Cloud Deployment

1. **Configure Project**
   ```bash
   npx sanity init
   ```

2. **Deploy Studio**
   ```bash
   npm run deploy
   ```

3. **Deploy GraphQL API** (optional)
   ```bash
   npm run deploy-graphql
   ```

### Environment Variables

Create `.env` file for local development:
```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Schema Reference](https://www.sanity.io/docs/schema-types)
- [Plugin Documentation](./IMAGEKIT_PLUGIN.md)

### Community
- [Sanity Discord](https://discord.gg/sanity-io)
- [GitHub Issues](https://github.com/Zura1555/sanity/issues)

### Troubleshooting

#### Common Issues

**Plugin not loading:**
- Check plugin dependencies in `package.json`
- Verify plugin configuration in `sanity.config.ts`
- Ensure proper imports

**TypeScript errors:**
- Run `npm run build` to check for type errors
- Verify all types are properly imported
- Check schema type definitions

**Build failures:**
- Clear `node_modules` and reinstall dependencies
- Check for peer dependency conflicts
- Verify all imports are correct

## 🔄 Changelog

### [Latest Version] - 2024-11-02
- ✅ Added Code Input plugin for syntax highlighting
- ✅ Integrated Markdown plugin with live preview
- ✅ Configured Cloudinary plugin for media management
- ✅ Implemented ImageKit plugin for video hosting
- ✅ Enhanced schema types with plugin fields
- ✅ Added comprehensive documentation

## 📈 Roadmap

- [ ] **Advanced Media Management** - Additional cloud storage providers
- [ ] **SEO Optimization** - Enhanced metadata and structured data
- [ ] **Performance Monitoring** - Analytics and performance tracking
- [ ] **Mobile Optimization** - Responsive design improvements
- [ ] **Accessibility** - WCAG compliance enhancements

---

**Built with ❤️ using [Sanity](https://sanity.io)**

For more information, visit the [GitHub repository](https://github.com/Zura1555/sanity).
