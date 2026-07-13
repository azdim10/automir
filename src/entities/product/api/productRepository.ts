import { supabase, type TableRow } from '@shared/api/supabase'
import { normalizeSupabaseError } from '@shared/lib/errors'

import {
  mapProduct,
  mapProductAttribute,
  mapProductCategory,
  mapProductImage,
  mapProductModification,
  mapProductSpecification,
} from '../model/product.mappers'
import type {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
  ProductListParams,
  ProductListResult,
  ProductModification,
  ProductSpecification,
} from '../model/product.types'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 24

function groupByProductId<TItem extends { productId: string }>(
  items: TItem[],
): Map<string, TItem[]> {
  const grouped = new Map<string, TItem[]>()

  for (const item of items) {
    const current = grouped.get(item.productId) ?? []
    current.push(item)
    grouped.set(item.productId, current)
  }

  return grouped
}

async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data?.id ?? null
}

async function getProductsImages(
  productIds: string[],
): Promise<Map<string, ProductImage[]>> {
  if (productIds.length === 0) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return groupByProductId(data.map(mapProductImage))
}

async function getProductsAttributes(
  productIds: string[],
): Promise<Map<string, ProductAttribute[]>> {
  if (productIds.length === 0) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('product_attributes')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return groupByProductId(data.map(mapProductAttribute))
}

async function getProductsSpecifications(
  productIds: string[],
): Promise<Map<string, ProductSpecification[]>> {
  if (productIds.length === 0) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('product_specifications')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return groupByProductId(data.map(mapProductSpecification))
}

async function getProductsModifications(
  productIds: string[],
): Promise<Map<string, ProductModification[]>> {
  if (productIds.length === 0) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('product_modifications')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return groupByProductId(data.map(mapProductModification))
}

async function getProductsCategories(
  categoryIds: string[],
): Promise<Map<string, ProductCategory>> {
  if (categoryIds.length === 0) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .in('id', categoryIds)

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return new Map(data.map((row) => [row.id, mapProductCategory(row)]))
}

async function hydrateProducts(
  rows: TableRow<'products'>[],
): Promise<Product[]> {
  const productIds = rows.map((row) => row.id)
  const categoryIds = Array.from(new Set(rows.map((row) => row.category_id)))

  const [imagesByProductId, attributesByProductId, specificationsByProductId, modificationsByProductId, categoriesById] =
    await Promise.all([
      getProductsImages(productIds),
      getProductsAttributes(productIds),
      getProductsSpecifications(productIds),
      getProductsModifications(productIds),
      getProductsCategories(categoryIds),
    ])

  return rows.map((row) =>
    mapProduct({
      row,
      category: categoriesById.get(row.category_id) ?? null,
      images: imagesByProductId.get(row.id) ?? [],
      attributes: attributesByProductId.get(row.id) ?? [],
      specifications: specificationsByProductId.get(row.id) ?? [],
      modifications: modificationsByProductId.get(row.id) ?? [],
    }),
  )
}

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductListResult> {
  const page = params.page ?? DEFAULT_PAGE
  const limit = params.limit ?? DEFAULT_LIMIT
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (params.featured !== undefined) {
    query = query.eq('is_featured', params.featured)
  }

  if (params.categorySlug) {
    const categoryId = await getCategoryIdBySlug(params.categorySlug)

    if (!categoryId) {
      return { items: [], total: 0 }
    }

    query = query.eq('category_id', categoryId)
  }

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,sku.ilike.%${params.search}%`,
    )
  }

  if (params.sort === 'price-asc') {
    query = query.order('price', { ascending: true })
  } else if (params.sort === 'price-desc') {
    query = query.order('price', { ascending: false })
  } else if (params.sort === 'name-asc') {
    query = query.order('name', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return {
    items: await hydrateProducts(data),
    total: count ?? data.length,
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    throw normalizeSupabaseError(error)
  }

  const products = await hydrateProducts([data])
  const product = products[0]

  if (!product) {
    throw new Error('Product was not hydrated')
  }

  return product
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    throw normalizeSupabaseError(error)
  }

  const products = await hydrateProducts([data])
  const product = products[0]

  if (!product) {
    throw new Error('Product was not hydrated')
  }

  return product
}

export async function getFeaturedProducts(limit: number): Promise<Product[]> {
  const result = await getProducts({
    featured: true,
    limit,
    page: 1,
    sort: 'created-desc',
  })

  return result.items
}
