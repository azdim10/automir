import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  adminQueryKeys,
  deleteAdminMediaAsset,
  getAdminMediaAssets,
  uploadAdminMediaAsset,
  type AdminMediaAsset,
} from '@entities/admin'

export function useAdminMediaAssets(folderPrefix?: string) {
  return useQuery({
    queryKey: adminQueryKeys.mediaAssets(folderPrefix),
    queryFn: () => getAdminMediaAssets(folderPrefix),
  })
}

export function useUploadAdminMediaAsset(folderPrefix: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      alt,
      file,
    }: {
      alt: string
      file: File
    }): Promise<AdminMediaAsset> => {
      return uploadAdminMediaAsset({
        alt,
        file,
        folder: folderPrefix,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.mediaAssets(),
      })
    },
  })
}

export function useDeleteAdminMediaAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminMediaAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.mediaAssets(),
      })
    },
  })
}
