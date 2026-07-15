export const adminQueryKeys = {
  all: ['admin'] as const,
  callbacks: () => [...adminQueryKeys.all, 'callbacks'] as const,
  categories: () => [...adminQueryKeys.all, 'categories'] as const,
  infoPages: () => [...adminQueryKeys.all, 'info-pages'] as const,
  orders: () => [...adminQueryKeys.all, 'orders'] as const,
  products: () => [...adminQueryKeys.all, 'products'] as const,
  mediaAssetsRoot: () => [...adminQueryKeys.all, 'media-assets'] as const,
  mediaAssets: (folderPrefix?: string) =>
    [...adminQueryKeys.mediaAssetsRoot(), folderPrefix ?? 'all'] as const,
}
