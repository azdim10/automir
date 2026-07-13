export const adminQueryKeys = {
  all: ['admin'] as const,
  callbacks: () => [...adminQueryKeys.all, 'callbacks'] as const,
  categories: () => [...adminQueryKeys.all, 'categories'] as const,
  infoPages: () => [...adminQueryKeys.all, 'info-pages'] as const,
  orders: () => [...adminQueryKeys.all, 'orders'] as const,
  products: () => [...adminQueryKeys.all, 'products'] as const,
}
