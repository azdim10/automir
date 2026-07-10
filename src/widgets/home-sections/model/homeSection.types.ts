import type { Json } from '@shared/api/supabase'

export type HomeSectionActionVariant = 'primary' | 'secondary' | 'outline'

export interface HomeSectionImage {
  url: string
  alt: string
}

export interface HomeSectionAction {
  label: string
  href: string
  variant?: HomeSectionActionVariant
}

export interface HeroSectionPayload {
  eyebrow?: string
  title: string
  description?: string
  image?: HomeSectionImage
  actions?: HomeSectionAction[]
}

export interface BannerSectionPayload {
  title: string
  description?: string
  image?: HomeSectionImage
  actions?: HomeSectionAction[]
}

export interface ImageTextSectionPayload {
  title: string
  description?: string
  image: HomeSectionImage
  imagePosition?: 'left' | 'right'
  actions?: HomeSectionAction[]
}

export interface FeatureGridItem {
  title: string
  description?: string
  image?: HomeSectionImage
  href?: string
}

export interface FeatureGridSectionPayload {
  title?: string
  description?: string
  items: FeatureGridItem[]
}

export type HomeSectionPayload =
  | HeroSectionPayload
  | BannerSectionPayload
  | ImageTextSectionPayload
  | FeatureGridSectionPayload

export interface HomePageSection {
  id: string
  type: string
  sortOrder: number
  payload: Json
}
