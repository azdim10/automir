import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  title?: string
  type: ToastType
}

interface ToastStore {
  dismiss: (id: string) => void
  show: (toast: Omit<ToastItem, 'id'>) => void
  toasts: ToastItem[]
}

let toastId = 0

function createToastId() {
  toastId += 1

  return `toast-${String(toastId)}`
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (toast) => {
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: createToastId() }],
    }))
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
}))

export function showToast(toast: Omit<ToastItem, 'id'>) {
  useToastStore.getState().show(toast)
}
