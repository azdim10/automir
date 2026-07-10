export const orderQueryKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...orderQueryKeys.all, 'detail', id] as const,
}
