import {Box, Text, Flex, Button, Card} from '@sanity/ui'
import {client} from './client'
import {useState, useEffect} from 'react'
import {FolderIcon, ImageIcon} from '@sanity/icons'

interface Asset {
  _id: string
  _type: string
  title: string
  type: 'folder' | 'image'
  color?: string
  image?: {
    asset: {
      _ref: string
    }
  }
  parentFolder?: {
    _ref: string
  }
  children?: Asset[]
}

const FolderTreeView = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setError(null)
      setLoading(true)
      const query = `
        *[_type == "asset"] {
          _id,
          _type,
          title,
          type,
          color,
          image,
          parentFolder
        } | order(type asc, title asc)
      `
      const result = await client.fetch(query)
      setAssets(result)
    } catch (error) {
      console.error('Error fetching assets:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load assets'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const buildFolderTree = (assets: Asset[]): Asset[] => {
    const assetMap = new Map<string, Asset>()
    const rootFolders: Asset[] = []

    // Create map of all assets
    assets.forEach((asset) => {
      assetMap.set(asset._id, {...asset, children: []})
    })

    // Build tree structure
    assets.forEach((asset) => {
      const assetWithChildren = assetMap.get(asset._id)
      if (!assetWithChildren) return

      if (asset.parentFolder && assetMap.has(asset.parentFolder._ref)) {
        const parent = assetMap.get(asset.parentFolder._ref)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(assetWithChildren)
        }
      } else if (asset.type === 'folder') {
        // This is a root folder
        rootFolders.push(assetWithChildren)
      }
    })

    // Add orphaned images to root level
    assets.forEach((asset) => {
      if (asset.type === 'image' && !asset.parentFolder) {
        const orphanedAsset = assetMap.get(asset._id)
        if (orphanedAsset) {
          rootFolders.push(orphanedAsset)
        }
      }
    })

    return rootFolders
  }

  const renderAsset = (asset: Asset, level: number = 0) => {
    const isFolder = asset.type === 'folder'
    const hasChildren = asset.children && asset.children.length > 0

    const colors = {
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444',
      purple: '#8b5cf6',
      orange: '#f97316',
      gray: '#6b7280',
    }

    const folderColor = colors[asset.color as keyof typeof colors] || colors.blue

    if (isFolder) {
      return (
        <Box
          key={asset._id}
          marginBottom={1}
          role="treeitem"
          aria-label={`Folder: ${asset.title}`}
          aria-expanded={hasChildren}
        >
          <Card
            padding={2}
            radius={2}
            shadow={0}
            style={{
              marginLeft: `${level * 20}px`,
              borderLeft: `3px solid ${folderColor}`,
            }}
            tone="default"
            tabIndex={0}
          >
            <Flex align="center" gap={2}>
              <FolderIcon style={{color: folderColor}} aria-hidden="true" />
              <Text weight="semibold" size={2}>
                {asset.title}
              </Text>
              <Text size={1} muted aria-label={`Contains ${asset.children?.length || 0} items`}>
                ({asset.children?.length || 0} items)
              </Text>
            </Flex>
          </Card>
          {asset.children?.map((child) => renderAsset(child, level + 1))}
        </Box>
      )
    }

    return (
      <Card
        key={asset._id}
        padding={2}
        radius={2}
        shadow={0}
        style={{marginLeft: `${level * 20}px`}}
        tone="default"
        role="treeitem"
        aria-label={`Image: ${asset.title}`}
        tabIndex={0}
      >
        <Flex align="center" gap={2}>
          <ImageIcon style={{color: '#6b7280'}} aria-hidden="true" />
          <Text size={2}>{asset.title}</Text>
          {asset.image && (
            <Box flex={1} style={{textAlign: 'right'}}>
              <Text size={1} muted aria-label="Has image attachment">
                📷
              </Text>
            </Box>
          )}
        </Flex>
      </Card>
    )
  }

  if (loading) {
    return (
      <Box padding={4} role="status" aria-live="polite" aria-label="Loading assets">
        <Text>Loading assets...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box padding={4} role="alert" aria-live="assertive">
        <Card padding={4} radius={2} tone="critical">
          <Flex direction="column" gap={3} align="center">
            <Text weight="semibold">Error Loading Assets</Text>
            <Text size={2} muted id="error-message">
              {error}
            </Text>
            <Button
              text="Retry"
              mode="default"
              onClick={fetchAssets}
              aria-label="Retry loading assets"
              aria-describedby="error-message"
            />
          </Flex>
        </Card>
      </Box>
    )
  }

  const folderTree = buildFolderTree(assets)

  return (
    <Box
      padding={4}
      style={{minHeight: '100vh', backgroundColor: '#fafafa'}}
      role="main"
      aria-label="Asset Library"
    >
      <Flex direction="column" gap={3}>
        <Text size={3} weight="bold" as="h1">
          📁 Asset Library
        </Text>

        <Flex gap={2} marginBottom={3} role="toolbar" aria-label="Asset library actions">
          <Button
            text="Refresh"
            mode="ghost"
            onClick={fetchAssets}
            aria-label="Refresh asset list"
          />
          <Button text="New Folder" mode="ghost" aria-label="Create new folder" />
          <Button text="Upload Image" mode="ghost" aria-label="Upload new image" />
        </Flex>

        {folderTree.length === 0 ? (
          <Card padding={4} radius={2} tone="default" role="status">
            <Text align="center" muted>
              No assets found. Create your first folder or upload an image.
            </Text>
          </Card>
        ) : (
          <Box role="tree" aria-label="Asset folder tree">
            {folderTree.map((asset) => renderAsset(asset))}
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default FolderTreeView
