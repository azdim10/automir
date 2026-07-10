import { useMutation } from '@tanstack/react-query'

import type { CreateOrderInput } from '@entities/order'

import { createOrder } from '../api/createOrder'

export function useCreateOrder() {
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
  })
}
