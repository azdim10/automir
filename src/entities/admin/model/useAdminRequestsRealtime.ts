import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { supabase } from '@shared/api/supabase'

import { adminQueryKeys } from './admin.queryKeys'

export function useAdminRequestsRealtime(enabled: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) {
      return
    }

    const channel = supabase
      .channel('admin-requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          void queryClient.invalidateQueries({
            queryKey: adminQueryKeys.orders(),
          })
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'callback_requests' },
        () => {
          void queryClient.invalidateQueries({
            queryKey: adminQueryKeys.callbacks(),
          })
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [enabled, queryClient])
}
