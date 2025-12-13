export const templates = [
  {
    id: 'post-with-author',
    title: 'Post by Author',
    description: 'Create a new post with a pre-selected author',
    schemaType: 'post',
    parameters: [{name: 'authorId', type: 'string', title: 'Author ID'}],
    value: (params: {authorId: string}) => ({
      author: {_type: 'reference', _ref: params.authorId},
      publishedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'post-with-category',
    title: 'Post in Category',
    description: 'Create a new post in a specific category',
    schemaType: 'post',
    parameters: [{name: 'categoryId', type: 'string', title: 'Category ID'}],
    value: (params: {categoryId: string}) => ({
      categories: [{_type: 'reference', _ref: params.categoryId, _key: params.categoryId}],
      publishedAt: new Date().toISOString(),
    }),
  },
  {
    id: 'featured-category',
    title: 'Featured Category',
    description: 'Create a new featured category',
    schemaType: 'category',
    value: () => ({
      featured: true,
      color: 'blue',
      sortOrder: 1,
    }),
  },
]
