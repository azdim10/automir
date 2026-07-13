export const MANAGED_INFO_PAGE_SLUGS = [
  'delivery',
  'warranty',
  'about',
  'contacts',
] as const

export type ManagedInfoPageSlug = (typeof MANAGED_INFO_PAGE_SLUGS)[number]

export const MANAGED_INFO_PAGE_ROUTES: Record<ManagedInfoPageSlug, string> = {
  delivery: '/delivery',
  warranty: '/warranty',
  about: '/about',
  contacts: '/contacts',
}
