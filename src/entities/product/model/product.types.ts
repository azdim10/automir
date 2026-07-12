export type ProductSort =
  'created-desc' | 'price-asc' | 'price-desc' | 'name-asc'

export interface ProductListParams {
  categorySlug?: string
  search?: string
  sort?: ProductSort
  page?: number
  limit?: number
  featured?: boolean
}

export interface ProductImage {
  id: string
  productId: string
  assetId: string | null
  url: string
  alt: string
  sortOrder: number
}

export interface ProductAttribute {
  id: string
  productId: string
  name: string
  value: string
  sortOrder: number
}

export interface ProductCategory {
  id: string
  slug: string
  name: string
}

export interface Product {
  id: string
  slug: string
  categoryId: string
  category: ProductCategory | null
  name: string
  shortDescription: string | null
  description: string | null
  price: number
  oldPrice: number | null
  sku: string
  stockQuantity: number
  isFeatured: boolean
  images: ProductImage[]
  attributes: ProductAttribute[]
  createdAt: string
  updatedAt: string
}

export interface ProductListResult {
  items: Product[]
  total: number
}
