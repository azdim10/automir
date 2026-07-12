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
  if (error.code === '23503') {
    if (error.message.includes('products_category_id_fkey')) {
      return new AppError(
        'Нельзя удалить категорию: в ней есть товары',
        error.code,
      )
    }

    if (error.message.includes('order_items_product_id_fkey')) {
      return new AppError(
        'Нельзя удалить товар: он используется в заказах',
        error.code,
      )
    }
  }

  return new AppError(error.message, error.code)
}
