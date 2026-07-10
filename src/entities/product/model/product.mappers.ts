import type { TableRow } from '@shared/api/supabase'

import type {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
} from './product.types'

export function mapProductImage(row: TableRow<'product_images'>): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    assetId: row.asset_id,
    url: row.url,
    alt: row.alt,
    sortOrder: row.sort_order,
  }
}

export function mapProductAttribute(
  row: TableRow<'product_attributes'>,
): ProductAttribute {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    value: row.value,
    sortOrder: row.sort_order,
  }
}

export function mapProductCategory(
  row: TableRow<'categories'>,
): ProductCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
  }
}

interface MapProductParams {
  row: TableRow<'products'>
  category: ProductCategory | null
  images: ProductImage[]
  attributes: ProductAttribute[]
}

export function mapProduct({
  row,
  category,
  images,
  attributes,
}: MapProductParams): Product {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    category,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    oldPrice: row.old_price,
    currency: row.currency,
    sku: row.sku,
    stockQuantity: row.stock_quantity,
    isFeatured: row.is_featured,
    images,
    attributes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
