import type { Json } from '@shared/api/supabase'

export interface SiteSetting {
  id: string
  key: string
  value: Json
  updatedAt: string
}

export type SiteSettings = Record<string, Json>

export interface Page {
  id: string
  slug: string
  title: string
  metaTitle: string | null
  metaDescription: string | null
  updatedAt: string
}

export interface PageSection {
  id: string
  pageId: string
  type: string
  sortOrder: number
  payload: Json
}

export interface PageContent {
  page: Page
  sections: PageSection[]
}
