import type { TableRow } from '@shared/api/supabase'

import type { Category } from './category.types'

export function mapCategory(row: TableRow<'categories'>): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageAssetId: row.image_asset_id,
    imageUrl: row.image_url,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
  }
}
