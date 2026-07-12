export interface HeaderLabels {
  catalog: string
  contacts: string
  home: string
  news: string
  requestCall: string
}

export interface HeaderNavItem {
  label: string
  to: string
}

export function getHeaderNavItems(labels: HeaderLabels): HeaderNavItem[] {
  return [
    { label: labels.home, to: '/' },
    { label: labels.catalog, to: '/catalog' },
    { label: labels.contacts, to: '/contacts' },
    { label: labels.news, to: '/news' },
  ]
}
