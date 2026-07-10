import { useQuery } from '@tanstack/react-query'

import { getPageContent } from '../api/contentRepository'
import { contentQueryKeys } from './content.queryKeys'

export function usePageContent(slug: string | undefined) {
  return useQuery({
    queryKey: contentQueryKeys.page(slug ?? ''),
    queryFn: () => getPageContent(slug ?? ''),
    enabled: Boolean(slug),
  })
}
