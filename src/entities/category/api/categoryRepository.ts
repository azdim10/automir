import { supabase } from '@shared/api/supabase'
import { normalizeSupabaseError } from '@shared/lib/errors'

import { mapCategory } from '../model/category.mappers'
import type { Category } from '../model/category.types'

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return data.map(mapCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    throw normalizeSupabaseError(error)
  }

  return mapCategory(data)
}
