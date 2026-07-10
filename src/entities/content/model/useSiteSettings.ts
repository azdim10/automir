import { useQuery } from '@tanstack/react-query'

import { getSiteSettings } from '../api/contentRepository'
import { contentQueryKeys } from './content.queryKeys'

export function useSiteSettings() {
  return useQuery({
    queryKey: contentQueryKeys.siteSettings(),
    queryFn: getSiteSettings,
  })
}
