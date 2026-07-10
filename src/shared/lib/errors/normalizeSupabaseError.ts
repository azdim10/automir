import type { PostgrestError } from '@supabase/supabase-js'

export class AppError extends Error {
  readonly code: string | undefined

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}

export function normalizeSupabaseError(error: PostgrestError): AppError {
  return new AppError(error.message, error.code)
}
