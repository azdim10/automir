import { supabase } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'

import type { SiteSettings } from '../model/content.types'

const SITE_MEDIA_FIELDS = {
  footer_settings: [
    { assetKey: 'backgroundAssetId', urlKey: 'backgroundUrl' },
    { assetKey: 'certificateAssetId', urlKey: 'certificateUrl' },
  ],
  site_profile: [{ assetKey: 'logoAssetId', urlKey: 'logoUrl' }],
} as const

function collectAssetIds(settings: SiteSettings): string[] {
  const assetIds = new Set<string>()

  for (const [settingKey, fields] of Object.entries(SITE_MEDIA_FIELDS)) {
    const value = settings[settingKey]

    if (!isJsonRecord(value)) {
      continue
    }

    for (const field of fields) {
      const assetId = getJsonString(value, field.assetKey)

      if (assetId) {
        assetIds.add(assetId)
      }
    }
  }

  return [...assetIds]
}

function collectUnresolvedUrls(settings: SiteSettings): string[] {
  const urls = new Set<string>()

  for (const [settingKey, fields] of Object.entries(SITE_MEDIA_FIELDS)) {
    const value = settings[settingKey]

    if (!isJsonRecord(value)) {
      continue
    }

    for (const field of fields) {
      const assetId = getJsonString(value, field.assetKey)
      const url = getJsonString(value, field.urlKey)

      if (!assetId && url) {
        urls.add(url)
      }
    }
  }

  return [...urls]
}

function patchSettingValue(
  value: SiteSettings[string],
  fields: (typeof SITE_MEDIA_FIELDS)[keyof typeof SITE_MEDIA_FIELDS],
  urlByAssetId: Map<string, string>,
  assetIdByPublicUrl: Map<string, string>,
): SiteSettings[string] {
  if (!isJsonRecord(value)) {
    return value
  }

  const nextValue = { ...value }

  for (const field of fields) {
    const assetId = getJsonString(nextValue, field.assetKey)
    const currentUrl = getJsonString(nextValue, field.urlKey)

    if (assetId) {
      const resolvedUrl = urlByAssetId.get(assetId)

      if (resolvedUrl) {
        nextValue[field.urlKey] = resolvedUrl
      }

      continue
    }

    if (!currentUrl) {
      continue
    }

    const resolvedAssetId = assetIdByPublicUrl.get(currentUrl)

    if (resolvedAssetId) {
      nextValue[field.assetKey] = resolvedAssetId
    }
  }

  return nextValue
}

export async function resolveSiteSettingsMedia(
  settings: SiteSettings,
): Promise<SiteSettings> {
  const assetIds = collectAssetIds(settings)
  const unresolvedUrls = collectUnresolvedUrls(settings)

  if (assetIds.length === 0 && unresolvedUrls.length === 0) {
    return settings
  }

  let assetRows: { id: string; public_url: string }[] = []

  if (assetIds.length > 0) {
    const { data, error } = await supabase
      .from('media_assets')
      .select('id, public_url')
      .in('id', assetIds)

    if (error) {
      throw error
    }

    assetRows = data
  }

  let urlRows: { id: string; public_url: string }[] = []

  if (unresolvedUrls.length > 0) {
    const { data, error } = await supabase
      .from('media_assets')
      .select('id, public_url')
      .in('public_url', unresolvedUrls)

    if (error) {
      throw error
    }

    urlRows = data
  }

  const urlByAssetId = new Map(
    assetRows.map((asset) => [asset.id, asset.public_url]),
  )
  const assetIdByPublicUrl = new Map(
    [...assetRows, ...urlRows].map((asset) => [asset.public_url, asset.id]),
  )

  return {
    ...settings,
    ...(settings.footer_settings
      ? {
          footer_settings: patchSettingValue(
            settings.footer_settings,
            SITE_MEDIA_FIELDS.footer_settings,
            urlByAssetId,
            assetIdByPublicUrl,
          ),
        }
      : {}),
    ...(settings.site_profile
      ? {
          site_profile: patchSettingValue(
            settings.site_profile,
            SITE_MEDIA_FIELDS.site_profile,
            urlByAssetId,
            assetIdByPublicUrl,
          ),
        }
      : {}),
  }
}
