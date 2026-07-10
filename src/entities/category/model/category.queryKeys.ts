export const categoryQueryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryQueryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryQueryKeys.all, 'detail', slug] as const,
}
