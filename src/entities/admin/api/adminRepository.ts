import {
  supabase,
  type Json,
  type TableInsert,
  type TableRow,
  type TableUpdate,
} from '@shared/api/supabase'
import { STORE_CURRENCY } from '@shared/config'
import { normalizeSupabaseError } from '@shared/lib/errors'

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
  publicUrl: string
}

function getSafeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
}

function assertSupportedImage(file: File): void {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image size must be 10 MB or less')
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || 'unknown'}`)
  }
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
  assertSupportedImage(file)

  const assetId = crypto.randomUUID()
  const path = `${folder}/${crypto.randomUUID()}-${getSafeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
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
    mime_type: file.type,
    path,
    public_url: publicUrl,
    size_bytes: file.size,
  })

  if (assetError) {
    throw normalizeSupabaseError(assetError)
  }

  return {
    assetId,
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
