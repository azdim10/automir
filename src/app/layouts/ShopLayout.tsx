import { Outlet } from 'react-router'

import { useSiteSettings } from '@entities/content'
import type { CallbackLabels } from '@features/request-callback'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  AppFooter,
  AppFooterSkeleton,
  parseFooterLabels,
  parseFooterSettings,
} from '@widgets/app-footer'
import { AppHeader, AppHeaderSkeleton } from '@widgets/app-header'
import type { HeaderLabels } from '@widgets/app-header/model/headerNav'

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

function parseHeaderLabels(value: Json | undefined): HeaderLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const keys: (keyof HeaderLabels)[] = [
    'home',
    'catalog',
    'delivery',
    'warranty',
    'about',
    'contacts',
    'news',
    'requestCall',
    'search',
    'searchPlaceholder',
  ]
  const labels: Partial<HeaderLabels> = {}

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as HeaderLabels
}

function parseCallbackLabels(value: Json | undefined): CallbackLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const keys: (keyof CallbackLabels)[] = [
    'close',
    'description',
    'error',
    'name',
    'phone',
    'requestCall',
    'submit',
    'success',
    'title',
  ]
  const labels: Partial<CallbackLabels> = {}

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as CallbackLabels
}

export function ShopLayout() {
  const { data: siteSettings, isLoading } = useSiteSettings()
  const siteProfile = parseSiteProfile(siteSettings?.site_profile)
  const cartAriaLabel = parseCartAriaLabel(siteSettings?.cart_labels)
  const headerLabels = parseHeaderLabels(siteSettings?.header_labels)
  const callbackLabels = parseCallbackLabels(siteSettings?.callback_labels)
  const footerLabels = parseFooterLabels(siteSettings?.footer_labels)
  const footerSettings = parseFooterSettings(siteSettings?.footer_settings)

  if (
    isLoading ||
    !siteProfile ||
    !cartAriaLabel ||
    !headerLabels ||
    !callbackLabels
  ) {
    return (
      <>
        <AppHeaderSkeleton />
        <Outlet />
        <AppFooterSkeleton />
      </>
    )
  }

  return (
    <>
      <AppHeader
        callbackLabels={callbackLabels}
        cartAriaLabel={cartAriaLabel}
        headerLabels={headerLabels}
        logoAlt={siteProfile.logoAlt}
        logoUrl={siteProfile.logoUrl}
      />
      <Outlet />
      {footerLabels && footerSettings ? (
        <AppFooter labels={footerLabels} settings={footerSettings} />
      ) : (
        <AppFooterSkeleton />
      )}
    </>
  )
}
