import type { Json } from '@shared/api/supabase'

export type JsonRecord = Record<string, Json | undefined>

export function isJsonRecord(value: Json | undefined): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getJsonString(record: JsonRecord, key: string): string | null {
  const value = record[key]
  return typeof value === 'string' ? value : null
}

export function getJsonNumber(record: JsonRecord, key: string): number | null {
  const value = record[key]
  return typeof value === 'number' ? value : null
}
