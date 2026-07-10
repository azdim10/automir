export type QueryKeyPart = string | number | boolean | null | undefined

export function createQueryKey<TParts extends readonly QueryKeyPart[]>(
  scope: string,
  ...parts: TParts
) {
  return [scope, ...parts] as const
}
