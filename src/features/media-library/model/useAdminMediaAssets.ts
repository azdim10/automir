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
        queryKey: adminQueryKeys.mediaAssetsRoot(),
      })
    },
  })
}

export function useDeleteAdminMediaAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminMediaAsset,
    onMutate: async (assetId) => {
      await queryClient.cancelQueries({
        queryKey: adminQueryKeys.mediaAssetsRoot(),
      })

      const previousQueries = queryClient.getQueriesData<AdminMediaAsset[]>({
        queryKey: adminQueryKeys.mediaAssetsRoot(),
      })

      queryClient.setQueriesData<AdminMediaAsset[]>(
        { queryKey: adminQueryKeys.mediaAssetsRoot() },
        (assets) => assets?.filter((asset) => asset.id !== assetId),
      )

      return { previousQueries }
    },
    onError: (_error, _assetId, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.mediaAssetsRoot(),
      })
    },
  })
}
