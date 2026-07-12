import { supabase } from '@shared/api/supabase'
import { normalizeSupabaseError } from '@shared/lib/errors'

import type { CreateCallbackRequestInput } from '../model/callback.types'

export async function createCallbackRequest(
  input: CreateCallbackRequestInput,
): Promise<void> {
  const { error } = await supabase.from('callback_requests').insert({
    customer_name: input.name,
    customer_phone: input.phone,
    status: 'new',
  })

  if (error) {
    throw normalizeSupabaseError(error)
  }
}
