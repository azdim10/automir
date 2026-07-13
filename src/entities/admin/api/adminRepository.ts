import {
  supabase,
  type Json,
  type TableInsert,
  type TableRow,
  type TableUpdate,
} from '@shared/api/supabase'
import { STORE_CURRENCY } from '@shared/config'
import { MANAGED_INFO_PAGE_SLUGS } from '@entities/content/model/managedPages'
import type { ManagedInfoPageSlug } from '@entities/content/model/managedPages'
import { normalizeSupabaseError } from '@shared/lib/errors'
import { getJsonString, isJsonRecord } from '@shared/lib/json'

const PRODUCT_IMAGE_BUCKET = 'site-images'
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/x-icon',
])

interface UploadedAdminImage {
  assetId: string
  path: string
  publicUrl: string
}

function getSafeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
}

function resolveImageMimeType(file: File): string {
  if (file.type && SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return file.type
  }

  const extension = file.name.split('.').pop()?.toLowerCase()
  const extensionMimeMap: Record<string, string> = {
    avif: 'image/avif',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  }
  const mimeType = extensionMimeMap[extension ?? '']

  if (!mimeType || !SUPPORTED_IMAGE_TYPES.has(mimeType)) {
    throw new Error(
      `Unsupported image type: ${(file.type || extension) ?? 'unknown'}`,
    )
  }

  return mimeType
}

function assertSupportedImage(file: File): string {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image size must be 10 MB or less')
  }

  return resolveImageMimeType(file)
}

async function uploadAdminImage({
  alt,
  file,
  folder,
}: {
  alt: string
  file: File
  folder: string
}): Promise<UploadedAdminImage> {
  const mimeType = assertSupportedImage(file)

  const assetId = crypto.randomUUID()
  const path = `${folder}/${crypto.randomUUID()}-${getSafeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path)
  const publicUrl = data.publicUrl

  const { error: assetError } = await supabase.from('media_assets').insert({
    id: assetId,
    alt,
    bucket_id: PRODUCT_IMAGE_BUCKET,
    mime_type: mimeType,
    path,
    public_url: publicUrl,
    size_bytes: file.size,
  })

  if (assetError) {
    throw normalizeSupabaseError(assetError)
  }

  return {
    assetId,
    path,
    publicUrl,
  }
}

export async function upsertAdminSiteSetting(
  key: string,
  value: Json,
): Promise<void> {
  const { error } = await supabase.from('site_settings').upsert(
    {
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' },
  )

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function uploadAdminSiteLogo({
  alt,
  file,
}: {
  alt: string
  file: File
}): Promise<string> {
  const image = await uploadAdminImage({
    alt,
    file,
    folder: 'settings/logo',
  })

  return image.publicUrl
}

export async function uploadAdminFooterBackground({
  alt,
  file,
}: {
  alt: string
  file: File
}): Promise<string> {
  const image = await uploadAdminImage({
    alt,
    file,
    folder: 'settings/footer',
  })

  return image.publicUrl
}

export async function uploadAdminFooterCertificate({
  alt,
  file,
}: {
  alt: string
  file: File
}): Promise<string> {
  const image = await uploadAdminImage({
    alt,
    file,
    folder: 'settings/footer-certificate',
  })

  return image.publicUrl
}

export interface AdminInfoPageRecord {
  page: TableRow<'pages'>
  secondarySection: TableRow<'page_sections'> | null
  section: TableRow<'page_sections'> | null
}

export interface SaveAdminInfoPageInput {
  catalogActionLabel: string
  descriptionLeft: string
  descriptionRight: string
  featuredDetailsLabel: string
  featuredProductIds: string[]
  featuredSectionId: string | null
  featuredTitle: string
  imageAlt: string
  imageFile: File | null
  imageUrl: string
  mapLatitude: string
  mapLongitude: string
  mapTitle: string
  mapZoom: string
  metaDescription: string
  metaTitle: string
  sectionId: string | null
  sectionText: string
  slug: ManagedInfoPageSlug
  title: string
}

function parseContentSectionPayload(value: Json | undefined) {
  if (!isJsonRecord(value)) {
    return {
      imageAlt: '',
      imageUrl: '',
      mapLatitude: '',
      mapLongitude: '',
      mapTitle: '',
      mapZoom: '16',
      sectionText: '',
      title: '',
    }
  }

  const image = isJsonRecord(value.image) ? value.image : undefined
  const map = isJsonRecord(value.map) ? value.map : undefined

  return {
    imageAlt: image ? (getJsonString(image, 'alt') ?? '') : '',
    imageUrl: image ? (getJsonString(image, 'url') ?? '') : '',
    mapLatitude:
      typeof map?.latitude === 'number' ? String(map.latitude) : '',
    mapLongitude:
      typeof map?.longitude === 'number' ? String(map.longitude) : '',
    mapTitle: map ? (getJsonString(map, 'title') ?? '') : '',
    mapZoom: typeof map?.zoom === 'number' ? String(map.zoom) : '16',
    sectionText: getJsonString(value, 'description') ?? '',
    title: getJsonString(value, 'title') ?? '',
  }
}

function parseWelcomeSectionPayload(value: Json | undefined) {
  if (!isJsonRecord(value)) {
    return {
      catalogActionLabel: '',
      descriptionLeft: '',
      descriptionRight: '',
      title: '',
    }
  }

  const actions = Array.isArray(value.actions) ? value.actions : []
  const firstAction = actions.find((item) => isJsonRecord(item))
  const actionRecord = isJsonRecord(firstAction) ? firstAction : undefined

  return {
    catalogActionLabel: actionRecord
      ? (getJsonString(actionRecord, 'label') ?? '')
      : '',
    descriptionLeft: getJsonString(value, 'descriptionLeft') ?? '',
    descriptionRight: getJsonString(value, 'descriptionRight') ?? '',
    title: getJsonString(value, 'title') ?? '',
  }
}

function parseProductIdsArray(value: Json | undefined): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (typeof item !== 'string') {
      return []
    }

    const trimmed = item.trim()

    return trimmed.length > 0 ? [trimmed] : []
  })
}

function parseFeaturedSectionPayload(value: Json | undefined) {
  if (!isJsonRecord(value)) {
    return {
      featuredDetailsLabel: 'Подробнее >>',
      featuredProductIds: [] as string[],
      featuredTitle: '',
    }
  }

  return {
    featuredDetailsLabel:
      getJsonString(value, 'detailsLabel') ?? 'Подробнее >>',
    featuredProductIds: parseProductIdsArray(value.productIds),
    featuredTitle: getJsonString(value, 'title') ?? '',
  }
}

async function upsertPageSection({
  pageId,
  payload,
  sectionId,
  sortOrder,
  type,
}: {
  pageId: string
  payload: Json
  sectionId: string | null
  sortOrder: number
  type: string
}): Promise<void> {
  if (sectionId) {
    const { error } = await supabase
      .from('page_sections')
      .update({
        is_active: true,
        payload,
        sort_order: sortOrder,
        type,
      })
      .eq('id', sectionId)

    if (error) {
      throw normalizeSupabaseError(error)
    }

    return
  }

  const { error } = await supabase.from('page_sections').insert({
    is_active: true,
    page_id: pageId,
    payload,
    sort_order: sortOrder,
    type,
  })

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function getAdminInfoPages(): Promise<AdminInfoPageRecord[]> {
  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('*')
    .in('slug', [...MANAGED_INFO_PAGE_SLUGS])
    .order('slug', { ascending: true })

  if (pagesError) {
    throw normalizeSupabaseError(pagesError)
  }

  const pageIds = pages.map((page) => page.id)

  if (pageIds.length === 0) {
    return MANAGED_INFO_PAGE_SLUGS.map((slug) => ({
      page: {
        id: '',
        slug,
        title: '',
        meta_title: null,
        meta_description: null,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      secondarySection: null,
      section: null,
    }))
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('page_sections')
    .select('*')
    .in('page_id', pageIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (sectionsError) {
    throw normalizeSupabaseError(sectionsError)
  }

  return MANAGED_INFO_PAGE_SLUGS.map((slug) => {
    const page =
      pages.find((item) => item.slug === slug) ??
      {
        id: '',
        slug,
        title: '',
        meta_title: null,
        meta_description: null,
        is_published: true,
        updated_at: new Date().toISOString(),
      }

    if (slug === 'home') {
      const section =
        sections.find(
          (item) =>
            item.page_id === page.id &&
            page.id.length > 0 &&
            item.type === 'welcome' &&
            item.sort_order === 0,
        ) ?? null
      const secondarySection =
        sections.find(
          (item) =>
            item.page_id === page.id &&
            page.id.length > 0 &&
            item.type === 'featured_products' &&
            item.sort_order === 1,
        ) ?? null

      return { page, secondarySection, section }
    }

    const section =
      sections.find(
        (item) =>
          item.page_id === page.id &&
          page.id.length > 0 &&
          item.type === 'content' &&
          item.sort_order === 0,
      ) ?? null

    return { page, secondarySection: null, section }
  })
}

export async function saveAdminInfoPage(
  input: SaveAdminInfoPageInput,
): Promise<void> {
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .upsert(
      {
        slug: input.slug,
        title: input.title,
        meta_title: input.metaTitle || input.title,
        meta_description: input.metaDescription,
        is_published: true,
      },
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (pageError) {
    throw normalizeSupabaseError(pageError)
  }

  if (input.slug === 'home') {
    const welcomePayload: Json = {
      title: input.title,
      descriptionLeft: input.descriptionLeft,
      descriptionRight: input.descriptionRight,
    }

    if (input.catalogActionLabel.trim()) {
      welcomePayload.actions = [
        {
          href: '/catalog',
          label: input.catalogActionLabel.trim(),
          variant: 'primary',
        },
      ]
    }

    const featuredPayload: Json = {
      detailsLabel: input.featuredDetailsLabel.trim() || 'Подробнее >>',
      productIds: input.featuredProductIds,
    }

    if (input.featuredTitle.trim()) {
      featuredPayload.title = input.featuredTitle.trim()
    }

    await Promise.all([
      upsertPageSection({
        pageId: page.id,
        payload: welcomePayload,
        sectionId: input.sectionId,
        sortOrder: 0,
        type: 'welcome',
      }),
      upsertPageSection({
        pageId: page.id,
        payload: featuredPayload,
        sectionId: input.featuredSectionId,
        sortOrder: 1,
        type: 'featured_products',
      }),
    ])

    return
  }

  let imageUrl = input.imageUrl.trim()
  const imageAlt = input.imageAlt.trim() || input.title

  if (input.imageFile) {
    const uploaded = await uploadAdminImage({
      alt: imageAlt,
      file: input.imageFile,
      folder: `pages/${input.slug}`,
    })
    imageUrl = uploaded.publicUrl
  }

  const payload: Json = {
    title: input.title,
    description: input.sectionText,
  }

  if (imageUrl) {
    payload.image = {
      alt: imageAlt,
      url: imageUrl,
    }
  }

  const mapLatitude = Number(input.mapLatitude)
  const mapLongitude = Number(input.mapLongitude)
  const mapZoom = Number(input.mapZoom)

  if (
    input.mapTitle.trim() &&
    Number.isFinite(mapLatitude) &&
    Number.isFinite(mapLongitude) &&
    Number.isFinite(mapZoom) &&
    mapZoom > 0
  ) {
    payload.map = {
      latitude: mapLatitude,
      longitude: mapLongitude,
      title: input.mapTitle.trim(),
      zoom: mapZoom,
    }
  }

  await upsertPageSection({
    pageId: page.id,
    payload,
    sectionId: input.sectionId,
    sortOrder: 0,
    type: 'content',
  })
}

export { parseContentSectionPayload, parseFeaturedSectionPayload, parseWelcomeSectionPayload }

export async function getAdminCategories(): Promise<TableRow<'categories'>[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data
}

export async function createAdminCategory(
  input: TableInsert<'categories'>,
): Promise<void> {
  const { error } = await supabase.from('categories').insert(input)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function updateAdminCategory(
  id: string,
  input: TableUpdate<'categories'>,
): Promise<void> {
  const { error } = await supabase.from('categories').update(input).eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)

  if (productsError) {
    throw normalizeSupabaseError(productsError)
  }

  for (const product of products) {
    await deleteAdminProduct(product.id)
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function getAdminProducts(): Promise<TableRow<'products'>[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data
}

export interface AdminMediaAsset {
  alt: string
  createdAt: string
  id: string
  mimeType: string | null
  path: string
  publicUrl: string
  sizeBytes: number | null
}

export interface AdminProductImageRecord {
  alt: string
  assetId: string | null
  id: string
  url: string
}

export interface AdminProductRecord {
  images: AdminProductImageRecord[]
  modifications: TableRow<'product_modifications'>[]
  product: TableRow<'products'>
  specifications: TableRow<'product_specifications'>[]
}

export interface ProductModificationInput {
  applicability: string
  designation: string
  features: string
}

export interface ProductSpecificationInput {
  name: string
  value: string
}

export interface SaveAdminProductInput {
  applicationArea: string
  categoryId: string
  description: string
  id: string | null
  imageAlt: string
  imageAssetId: string | null
  imageFile: File | null
  isActive: boolean
  isFeatured: boolean
  modifications: ProductModificationInput[]
  name: string
  packingNorm: string
  price: number
  productType: string
  sku: string
  sketchAlt: string
  sketchFile: File | null
  sketchUrl: string
  slug: string
  specifications: ProductSpecificationInput[]
  stockQuantity: number
}

async function replaceProductSpecifications(
  productId: string,
  specifications: ProductSpecificationInput[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('product_specifications')
    .delete()
    .eq('product_id', productId)

  if (deleteError) {
    throw normalizeSupabaseError(deleteError)
  }

  const rows = specifications
    .map((item, index) => ({
      name: item.name.trim(),
      product_id: productId,
      sort_order: index,
      value: item.value.trim(),
    }))
    .filter((item) => item.name.length > 0 && item.value.length > 0)

  if (rows.length === 0) {
    return
  }

  const { error: insertError } = await supabase
    .from('product_specifications')
    .insert(rows)

  if (insertError) {
    throw normalizeSupabaseError(insertError)
  }
}

async function replaceProductModifications(
  productId: string,
  modifications: ProductModificationInput[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('product_modifications')
    .delete()
    .eq('product_id', productId)

  if (deleteError) {
    throw normalizeSupabaseError(deleteError)
  }

  const rows = modifications
    .map((item, index) => ({
      applicability: item.applicability.trim(),
      designation: item.designation.trim(),
      features: item.features.trim(),
      product_id: productId,
      sort_order: index,
    }))
    .filter((item) => item.designation.length > 0)

  if (rows.length === 0) {
    return
  }

  const { error: insertError } = await supabase
    .from('product_modifications')
    .insert(rows)

  if (insertError) {
    throw normalizeSupabaseError(insertError)
  }
}

export async function getAdminProductsWithDetails(): Promise<
  AdminProductRecord[]
> {
  const products = await getAdminProducts()
  const productIds = products.map((product) => product.id)

  if (productIds.length === 0) {
    return []
  }

  const [specificationsResult, modificationsResult, imagesResult] =
    await Promise.all([
    supabase
      .from('product_specifications')
      .select('*')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_modifications')
      .select('*')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_images')
      .select('id, product_id, asset_id, url, alt, sort_order')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true }),
  ])

  if (specificationsResult.error) {
    throw normalizeSupabaseError(specificationsResult.error)
  }

  if (modificationsResult.error) {
    throw normalizeSupabaseError(modificationsResult.error)
  }

  if (imagesResult.error) {
    throw normalizeSupabaseError(imagesResult.error)
  }

  const specificationsByProductId = new Map<
    string,
    TableRow<'product_specifications'>[]
  >()
  const modificationsByProductId = new Map<
    string,
    TableRow<'product_modifications'>[]
  >()
  const imagesByProductId = new Map<string, AdminProductImageRecord[]>()

  for (const row of specificationsResult.data) {
    const current = specificationsByProductId.get(row.product_id) ?? []
    current.push(row)
    specificationsByProductId.set(row.product_id, current)
  }

  for (const row of modificationsResult.data) {
    const current = modificationsByProductId.get(row.product_id) ?? []
    current.push(row)
    modificationsByProductId.set(row.product_id, current)
  }

  for (const row of imagesResult.data) {
    const current = imagesByProductId.get(row.product_id) ?? []
    current.push({
      alt: row.alt,
      assetId: row.asset_id,
      id: row.id,
      url: row.url,
    })
    imagesByProductId.set(row.product_id, current)
  }

  return products.map((product) => ({
    images: imagesByProductId.get(product.id) ?? [],
    modifications: modificationsByProductId.get(product.id) ?? [],
    product,
    specifications: specificationsByProductId.get(product.id) ?? [],
  }))
}

export async function saveAdminProductWithDetails(
  input: SaveAdminProductInput,
): Promise<void> {
  const productData: Omit<TableInsert<'products'>, 'currency'> = {
    application_area: input.applicationArea.trim() || null,
    category_id: input.categoryId,
    description: input.description.trim() || null,
    is_active: input.isActive,
    is_featured: input.isFeatured,
    name: input.name,
    packing_norm: input.packingNorm.trim() || null,
    price: input.price,
    product_type: input.productType.trim() || null,
    sku: input.sku,
    slug: input.slug,
    stock_quantity: input.stockQuantity,
  }

  let productId = input.id

  if (productId) {
    await updateAdminProduct(productId, productData)
  } else {
    productId = await createAdminProduct(productData)
  }

  let sketchUrl = input.sketchUrl.trim()
  const sketchAlt = input.sketchAlt.trim() || input.name

  if (input.sketchFile) {
    const uploaded = await uploadAdminImage({
      alt: sketchAlt,
      file: input.sketchFile,
      folder: `products/${productId}/sketch`,
    })
    sketchUrl = uploaded.publicUrl
  }

  await updateAdminProduct(productId, {
    sketch_alt: sketchUrl ? sketchAlt : null,
    sketch_url: sketchUrl || null,
  })

  if (input.imageAssetId) {
    await linkAdminProductImageFromAsset({
      alt: input.imageAlt || input.name,
      assetId: input.imageAssetId,
      productId,
    })
  } else if (input.imageFile) {
    await uploadAdminProductImage({
      alt: input.imageAlt || input.name,
      file: input.imageFile,
      productId,
    })
  }

  await Promise.all([
    replaceProductSpecifications(productId, input.specifications),
    replaceProductModifications(productId, input.modifications),
  ])
}

export async function createAdminProduct(
  input: Omit<TableInsert<'products'>, 'currency'>,
): Promise<string> {
  const id = input.id ?? crypto.randomUUID()
  const { error } = await supabase.from('products').insert({
    ...input,
    id,
    currency: STORE_CURRENCY,
  })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return id
}

export async function updateAdminProduct(
  id: string,
  input: Omit<TableUpdate<'products'>, 'currency'>,
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ ...input, currency: STORE_CURRENCY })
    .eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const { data: orderItemRows, error: orderItemsSelectError } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', id)

  if (orderItemsSelectError) {
    throw normalizeSupabaseError(orderItemsSelectError)
  }

  const affectedOrderIds = [
    ...new Set(orderItemRows.map((item) => item.order_id)),
  ]

  if (orderItemRows.length > 0) {
    const { error: orderItemsDeleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('product_id', id)

    if (orderItemsDeleteError) {
      throw normalizeSupabaseError(orderItemsDeleteError)
    }

    for (const orderId of affectedOrderIds) {
      const { data: remainingItems, error: remainingItemsError } =
        await supabase
          .from('order_items')
          .select('total_price')
          .eq('order_id', orderId)

      if (remainingItemsError) {
        throw normalizeSupabaseError(remainingItemsError)
      }

      const totalAmount = remainingItems.reduce(
        (total, item) => total + item.total_price,
        0,
      )

      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', orderId)

      if (orderUpdateError) {
        throw normalizeSupabaseError(orderUpdateError)
      }
    }
  }

  const { data: imageRows, error: imagesError } = await supabase
    .from('product_images')
    .select('asset_id')
    .eq('product_id', id)

  if (imagesError) {
    throw normalizeSupabaseError(imagesError)
  }

  const assetIds = imageRows
    .map((image) => image.asset_id)
    .filter((assetId): assetId is string => Boolean(assetId))
  const { data: assetRows, error: assetsError } =
    assetIds.length > 0
      ? await supabase.from('media_assets').select('id,path').in('id', assetIds)
      : { data: [], error: null }

  if (assetsError) {
    throw normalizeSupabaseError(assetsError)
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }

  const paths = assetRows.map((asset) => asset.path)

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove(paths)

    if (storageError) {
      throw new Error(storageError.message)
    }

    const { error: mediaError } = await supabase
      .from('media_assets')
      .delete()
      .in(
        'id',
        assetRows.map((asset) => asset.id),
      )

    if (mediaError) {
      throw normalizeSupabaseError(mediaError)
    }
  }
}

export async function uploadAdminProductImage({
  alt,
  file,
  productId,
}: {
  alt: string
  file: File
  productId: string
}): Promise<void> {
  const image = await uploadAdminImage({
    alt,
    file,
    folder: `products/${productId}`,
  })

  const { error: imageError } = await supabase.from('product_images').insert({
    alt,
    asset_id: image.assetId,
    product_id: productId,
    url: image.publicUrl,
  })

  if (imageError) {
    throw normalizeSupabaseError(imageError)
  }
}

async function getMediaAssetUsageCount(assetId: string): Promise<number> {
  const [productImagesResult, categoriesResult] = await Promise.all([
    supabase
      .from('product_images')
      .select('id', { count: 'exact', head: true })
      .eq('asset_id', assetId),
    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('image_asset_id', assetId),
  ])

  if (productImagesResult.error) {
    throw normalizeSupabaseError(productImagesResult.error)
  }

  if (categoriesResult.error) {
    throw normalizeSupabaseError(categoriesResult.error)
  }

  return (productImagesResult.count ?? 0) + (categoriesResult.count ?? 0)
}

async function removeMediaAssetById(assetId: string): Promise<void> {
  const { data: asset, error: assetError } = await supabase
    .from('media_assets')
    .select('id, path')
    .eq('id', assetId)
    .maybeSingle()

  if (assetError) {
    throw normalizeSupabaseError(assetError)
  }

  if (!asset) {
    return
  }

  const { error: storageError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([asset.path])

  if (storageError) {
    throw new Error(storageError.message)
  }

  const { error: deleteError } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', assetId)

  if (deleteError) {
    throw normalizeSupabaseError(deleteError)
  }
}

export async function uploadAdminMediaAsset({
  alt,
  file,
  folder,
}: {
  alt: string
  file: File
  folder: string
}): Promise<AdminMediaAsset> {
  const uploaded = await uploadAdminImage({
    alt,
    file,
    folder,
  })

  return {
    alt,
    createdAt: new Date().toISOString(),
    id: uploaded.assetId,
    mimeType: resolveImageMimeType(file),
    path: uploaded.path,
    publicUrl: uploaded.publicUrl,
    sizeBytes: file.size,
  }
}

export async function getAdminMediaAssets(
  folderPrefix?: string,
): Promise<AdminMediaAsset[]> {
  let query = supabase
    .from('media_assets')
    .select('id, alt, path, public_url, mime_type, size_bytes, created_at')
    .order('created_at', { ascending: false })

  if (folderPrefix) {
    query = query.like('path', `${folderPrefix}%`)
  }

  const { data, error } = await query

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data.map((row) => ({
    alt: row.alt,
    createdAt: row.created_at,
    id: row.id,
    mimeType: row.mime_type,
    path: row.path,
    publicUrl: row.public_url,
    sizeBytes: row.size_bytes,
  }))
}

export async function deleteAdminMediaAsset(assetId: string): Promise<void> {
  const usageCount = await getMediaAssetUsageCount(assetId)

  if (usageCount > 0) {
    throw new Error(
      'Нельзя удалить: изображение используется в товарах или категориях',
    )
  }

  await removeMediaAssetById(assetId)
}

export async function linkAdminProductImageFromAsset({
  alt,
  assetId,
  productId,
}: {
  alt: string
  assetId: string
  productId: string
}): Promise<void> {
  const { data: asset, error: assetError } = await supabase
    .from('media_assets')
    .select('id, public_url')
    .eq('id', assetId)
    .single()

  if (assetError) {
    throw normalizeSupabaseError(assetError)
  }

  const { count, error: countError } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId)

  if (countError) {
    throw normalizeSupabaseError(countError)
  }

  const { error: imageError } = await supabase.from('product_images').insert({
    alt,
    asset_id: asset.id,
    product_id: productId,
    sort_order: count ?? 0,
    url: asset.public_url,
  })

  if (imageError) {
    throw normalizeSupabaseError(imageError)
  }
}

export async function deleteAdminProductImage(imageId: string): Promise<void> {
  const { data: image, error: imageError } = await supabase
    .from('product_images')
    .select('id, asset_id')
    .eq('id', imageId)
    .single()

  if (imageError) {
    throw normalizeSupabaseError(imageError)
  }

  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (deleteError) {
    throw normalizeSupabaseError(deleteError)
  }

  if (!image.asset_id) {
    return
  }

  const usageCount = await getMediaAssetUsageCount(image.asset_id)

  if (usageCount === 0) {
    await removeMediaAssetById(image.asset_id)
  }
}

export async function getAdminCallbackRequests(): Promise<
  TableRow<'callback_requests'>[]
> {
  const { data, error } = await supabase
    .from('callback_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data
}

export async function updateAdminCallbackRequestStatus(
  id: string,
  status: string,
): Promise<void> {
  const { error } = await supabase
    .from('callback_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}

export async function getAdminOrders(): Promise<TableRow<'orders'>[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data
}

export async function updateAdminOrderStatus(
  id: string,
  status: string,
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw normalizeSupabaseError(error)
  }
}
