import type { TableRow } from '@shared/api/supabase'

import type {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
  ProductModification,
  ProductSpecification,
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

export function mapProductSpecification(
  row: TableRow<'product_specifications'>,
): ProductSpecification {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    value: row.value,
    sortOrder: row.sort_order,
  }
}

export function mapProductModification(
  row: TableRow<'product_modifications'>,
): ProductModification {
  return {
    id: row.id,
    productId: row.product_id,
    designation: row.designation,
    features: row.features,
    applicability: row.applicability,
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
  specifications: ProductSpecification[]
  modifications: ProductModification[]
}

export function mapProduct({
  row,
  category,
  images,
  attributes,
  specifications,
  modifications,
}: MapProductParams): Product {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    category,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    productType: row.product_type,
    packingNorm: row.packing_norm,
    applicationArea: row.application_area,
    sketchUrl: row.sketch_url,
    sketchAlt: row.sketch_alt,
    price: row.price,
    oldPrice: row.old_price,
    sku: row.sku,
    stockQuantity: row.stock_quantity,
    isFeatured: row.is_featured,
    images,
    attributes,
    specifications,
    modifications,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
