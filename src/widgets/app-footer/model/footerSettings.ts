import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'

export interface FooterLabels {
  address: string
  email: string
  phoneFax: string
}

export interface FooterSettings {
  address: string
  backgroundAlt: string
  backgroundUrl: string | null
  companyName: string
  copyright: string
  emails: string[]
  phones: string[]
}

function parseStringArray(value: Json | undefined): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (typeof item !== 'string') {
      return []
    }

    const trimmed = item.trim()

    return trimmed.length > 0 ? [trimmed] : []
  })
}

export function parseFooterLabels(value: Json | undefined): FooterLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const keys: (keyof FooterLabels)[] = ['address', 'email', 'phoneFax']
  const labels: Partial<FooterLabels> = {}

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as FooterLabels
}

export function parseFooterSettings(value: Json | undefined): FooterSettings | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const copyright = getJsonString(value, 'copyright')
  const companyName = getJsonString(value, 'companyName')

  if (!copyright || !companyName) {
    return null
  }

  return {
    address: getJsonString(value, 'address') ?? '',
    backgroundAlt: getJsonString(value, 'backgroundAlt') ?? 'Фон футера',
    backgroundUrl: getJsonString(value, 'backgroundUrl'),
    companyName,
    copyright,
    emails: parseStringArray(value.emails),
    phones: parseStringArray(value.phones),
  }
}

export function splitMultilineValues(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function joinMultilineValues(values: string[]): string {
  return values.join('\n')
}
