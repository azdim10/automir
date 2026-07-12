export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled'

export interface OrderCustomer {
  name: string
  phone: string
  email: string | null
  deliveryAddress: string | null
}

export interface CreateOrderItemInput {
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  customer: OrderCustomer
  items: CreateOrderItemInput[]
}

export interface CreatedOrder {
  id: string
  status: OrderStatus
  totalAmount: number
}
