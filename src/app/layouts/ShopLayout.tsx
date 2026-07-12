import { Outlet } from 'react-router'

import { useSiteSettings } from '@entities/content'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import { AppHeader, AppHeaderSkeleton } from '@widgets/app-header'

interface SiteProfile {
  logoAlt: string | null
  logoUrl: string | null
  phone: string | null
  storeName: string
}

function parseSiteProfile(value: Json | undefined): SiteProfile | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const storeName = getJsonString(value, 'storeName')

  if (!storeName) {
    return null
  }

  return {
    logoAlt: getJsonString(value, 'logoAlt'),
    logoUrl: getJsonString(value, 'logoUrl'),
    phone: getJsonString(value, 'phone'),
    storeName,
  }
}

function parseCartAriaLabel(value: Json | undefined): string | null {
  if (!isJsonRecord(value)) {
    return null
  }

  return getJsonString(value, 'title')
}

function parseHeaderLabels(value: Json | undefined): string | null {
  if (!isJsonRecord(value)) {
    return null
  }

  return getJsonString(value, 'catalog')
}

export function ShopLayout() {
  const { data: siteSettings, isLoading } = useSiteSettings()
  const siteProfile = parseSiteProfile(siteSettings?.site_profile)
  const cartAriaLabel = parseCartAriaLabel(siteSettings?.cart_labels)
  const catalogLabel = parseHeaderLabels(siteSettings?.header_labels)

  if (isLoading || !siteProfile || !cartAriaLabel || !catalogLabel) {
    return (
      <>
        <AppHeaderSkeleton />
        <Outlet />
      </>
    )
  }

  return (
    <>
      <AppHeader
        cartAriaLabel={cartAriaLabel}
        catalogLabel={catalogLabel}
        logoAlt={siteProfile.logoAlt}
        logoUrl={siteProfile.logoUrl}
        phone={siteProfile.phone}
        storeName={siteProfile.storeName}
      />
      <Outlet />
    </>
  )
}
