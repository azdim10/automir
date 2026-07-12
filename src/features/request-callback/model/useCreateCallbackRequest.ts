import { useMutation } from '@tanstack/react-query'

import { createCallbackRequest } from '@entities/callback-request'
import type { CreateCallbackRequestInput } from '@entities/callback-request'

export function useCreateCallbackRequest() {
  return useMutation({
    mutationFn: (input: CreateCallbackRequestInput) => createCallbackRequest(input),
  })
}
