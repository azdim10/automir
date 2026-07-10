export const contentQueryKeys = {
  all: ['content'] as const,
  siteSettings: () => [...contentQueryKeys.all, 'site-settings'] as const,
  page: (slug: string) => [...contentQueryKeys.all, 'page', slug] as const,
}
