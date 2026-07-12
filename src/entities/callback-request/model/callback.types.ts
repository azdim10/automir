export interface CreateCallbackRequestInput {
  name: string
  phone: string
}

export type CallbackRequestStatus =
  | 'new'
  | 'processing'
  | 'completed'
  | 'cancelled'
