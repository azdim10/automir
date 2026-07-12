import { STORE_CURRENCY } from '@shared/config/currency'

export function formatCurrency(value: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: STORE_CURRENCY,
    }).format(value)
  } catch {
    return `${value.toLocaleString(locale)} ₽`
  }
}
