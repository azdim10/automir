import type { TableRow } from '@shared/api/supabase'

import type {
  Page,
  PageSection,
  SiteSetting,
  SiteSettings,
} from './content.types'

export function mapSiteSetting(row: TableRow<'site_settings'>): SiteSetting {
  return {
    id: row.id,
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
  }
}

export function mapSiteSettings(
  rows: TableRow<'site_settings'>[],
): SiteSettings {
  return rows.reduce<SiteSettings>((settings, row) => {
    settings[row.key] = row.value
    return settings
  }, {})
}

export function mapPage(row: TableRow<'pages'>): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  }
}

export function mapPageSection(row: TableRow<'page_sections'>): PageSection {
  return {
    id: row.id,
    pageId: row.page_id,
    type: row.type,
    sortOrder: row.sort_order,
    payload: row.payload,
  }
}
