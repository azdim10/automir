import { getJsonString, isJsonRecord } from '@shared/lib/json'

import type { Json } from '@shared/api/supabase'
import type {
  BannerSectionPayload,
  ContentSectionPayload,
  FeatureGridItem,
  FeatureGridSectionPayload,
  HeroSectionPayload,
  HomeSectionAction,
  HomeSectionActionVariant,
  HomeSectionImage,
  ImageTextSectionPayload,
  YandexMapPayload,
} from './homeSection.types'

function getOptionalString(
  record: Record<string, Json | undefined>,
  key: string,
) {
  return getJsonString(record, key) ?? undefined
}

function parseImage(value: Json | undefined): HomeSectionImage | undefined {
  if (!isJsonRecord(value)) {
    return undefined
  }

  const url = getJsonString(value, 'url')
  const alt = getJsonString(value, 'alt')

  if (!url || !alt) {
    return undefined
  }

  return { url, alt }
}

function parseActionVariant(
  value: string | null,
): HomeSectionActionVariant | undefined {
  if (value === 'primary' || value === 'secondary' || value === 'outline') {
    return value
  }

  return undefined
}

function parseActions(
  value: Json | undefined,
): HomeSectionAction[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const actions = value.flatMap((item): HomeSectionAction[] => {
    if (!isJsonRecord(item)) {
      return []
    }

    const label = getJsonString(item, 'label')
    const href = getJsonString(item, 'href')

    if (!label || !href) {
      return []
    }

    const action: HomeSectionAction = { label, href }
    const variant = parseActionVariant(getJsonString(item, 'variant'))

    if (variant) {
      action.variant = variant
    }

    return [action]
  })

  return actions.length > 0 ? actions : undefined
}

function parseFeatureGridItems(value: Json | undefined): FeatureGridItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item): FeatureGridItem[] => {
    if (!isJsonRecord(item)) {
      return []
    }

    const title = getJsonString(item, 'title')

    if (!title) {
      return []
    }

    const gridItem: FeatureGridItem = { title }
    const description = getOptionalString(item, 'description')
    const href = getOptionalString(item, 'href')
    const image = parseImage(item.image)

    if (description) {
      gridItem.description = description
    }

    if (href) {
      gridItem.href = href
    }

    if (image) {
      gridItem.image = image
    }

    return [gridItem]
  })
}

export function parseHeroPayload(payload: Json): HeroSectionPayload | null {
  if (!isJsonRecord(payload)) {
    return null
  }

  const title = getJsonString(payload, 'title')

  if (!title) {
    return null
  }

  const result: HeroSectionPayload = { title }
  const eyebrow = getOptionalString(payload, 'eyebrow')
  const description = getOptionalString(payload, 'description')
  const image = parseImage(payload.image)
  const actions = parseActions(payload.actions)

  if (eyebrow) {
    result.eyebrow = eyebrow
  }

  if (description) {
    result.description = description
  }

  if (image) {
    result.image = image
  }

  if (actions) {
    result.actions = actions
  }

  return result
}

export function parseBannerPayload(payload: Json): BannerSectionPayload | null {
  if (!isJsonRecord(payload)) {
    return null
  }

  const title = getJsonString(payload, 'title')

  if (!title) {
    return null
  }

  const result: BannerSectionPayload = { title }
  const description = getOptionalString(payload, 'description')
  const image = parseImage(payload.image)
  const actions = parseActions(payload.actions)

  if (description) {
    result.description = description
  }

  if (image) {
    result.image = image
  }

  if (actions) {
    result.actions = actions
  }

  return result
}

export function parseImageTextPayload(
  payload: Json,
): ImageTextSectionPayload | null {
  if (!isJsonRecord(payload)) {
    return null
  }

  const title = getJsonString(payload, 'title')
  const image = parseImage(payload.image)
  const imagePosition = getJsonString(payload, 'imagePosition')

  if (!title || !image) {
    return null
  }

  const result: ImageTextSectionPayload = {
    title,
    image,
    imagePosition: imagePosition === 'left' ? 'left' : 'right',
  }
  const description = getOptionalString(payload, 'description')
  const actions = parseActions(payload.actions)

  if (description) {
    result.description = description
  }

  if (actions) {
    result.actions = actions
  }

  return result
}

export function parseFeatureGridPayload(
  payload: Json,
): FeatureGridSectionPayload | null {
  if (!isJsonRecord(payload)) {
    return null
  }

  const items = parseFeatureGridItems(payload.items)

  if (items.length === 0) {
    return null
  }

  const result: FeatureGridSectionPayload = { items }
  const title = getOptionalString(payload, 'title')
  const description = getOptionalString(payload, 'description')

  if (title) {
    result.title = title
  }

  if (description) {
    result.description = description
  }

  return result
}

export function parseContentPayload(payload: Json): ContentSectionPayload | null {
  if (!isJsonRecord(payload)) {
    return null
  }

  const title = getJsonString(payload, 'title')

  if (!title) {
    return null
  }

  const result: ContentSectionPayload = { title }
  const description = getOptionalString(payload, 'description')
  const image = parseImage(payload.image)

  if (description) {
    result.description = description
  }

  if (image) {
    result.image = image
  }

  const map = parseYandexMapPayload(payload.map)

  if (map) {
    result.map = map
  }

  return result
}

function parseYandexMapPayload(value: Json | undefined): YandexMapPayload | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const title = getJsonString(value, 'title')
  const latitude = value.latitude
  const longitude = value.longitude
  const zoom = value.zoom

  if (
    !title ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof zoom !== 'number'
  ) {
    return null
  }

  return {
    title,
    latitude,
    longitude,
    zoom,
  }
}
