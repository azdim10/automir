export function formatCurrency(
  value: number,
  currency: string,
  locale: string,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}
