import { supabase } from '@shared/api/supabase'
import { STORE_CURRENCY } from '@shared/config'
import { normalizeSupabaseError } from '@shared/lib/errors'

import type { CreatedOrder, CreateOrderInput } from '../model/order.types'

function getOrderTotal(input: CreateOrderInput): number {
  return input.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  )
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreatedOrder> {
  const orderId = crypto.randomUUID()
  const totalAmount = getOrderTotal(input)
  const status = 'new'

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    status,
    customer_name: input.customer.name,
    customer_phone: input.customer.phone,
    customer_email: input.customer.email,
    delivery_address: input.customer.deliveryAddress,
    total_amount: totalAmount,
    currency: STORE_CURRENCY,
  })

  if (orderError) {
    throw normalizeSupabaseError(orderError)
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      product_sku: item.productSku,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    })),
  )

  if (itemsError) {
    throw normalizeSupabaseError(itemsError)
  }

  return {
    id: orderId,
    status,
    totalAmount,
  }
}
