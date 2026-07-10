import { supabase } from '@shared/api/supabase'
import { normalizeSupabaseError } from '@shared/lib/errors'

import {
  mapPage,
  mapPageSection,
  mapSiteSettings,
} from '../model/content.mappers'
import type { PageContent, SiteSettings } from '../model/content.types'

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return mapSiteSettings(data)
}

export async function getPageContent(slug: string): Promise<PageContent> {
  const { data: pageRow, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (pageError) {
    throw normalizeSupabaseError(pageError)
  }

  const { data: sectionRows, error: sectionsError } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageRow.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (sectionsError) {
    throw normalizeSupabaseError(sectionsError)
  }

  return {
    page: mapPage(pageRow),
    sections: sectionRows.map(mapPageSection),
  }
}
