export interface HeaderLabels {
  about: string
  catalog: string
  contacts: string
  delivery: string
  home: string
  news: string
  requestCall: string
  search: string
  searchPlaceholder: string
  warranty: string
}

export interface HeaderNavItem {
  label: string
  to: string
}

export function getHeaderNavItems(labels: HeaderLabels): HeaderNavItem[] {
  return [
    { label: labels.home, to: '/' },
    { label: labels.catalog, to: '/catalog/categories' },
    { label: labels.delivery, to: '/delivery' },
    { label: labels.warranty, to: '/warranty' },
    { label: labels.about, to: '/about' },
    { label: labels.contacts, to: '/contacts' },
    { label: labels.news, to: '/news' },
  ]
}
