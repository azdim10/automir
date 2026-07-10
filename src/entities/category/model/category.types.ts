export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  imageAssetId: string | null
  imageUrl: string | null
  parentId: string | null
  sortOrder: number
}
