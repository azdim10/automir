import { useState, type ChangeEvent } from 'react'

import type { AdminMediaAsset } from '@entities/admin'
import { Button, Loader, Modal, Typography } from '@shared/ui'

import {
  useAdminMediaAssets,
  useDeleteAdminMediaAsset,
  useUploadAdminMediaAsset,
} from '../model/useAdminMediaAssets'

export interface MediaLibraryLabels {
  choose: string
  close: string
  delete: string
  empty: string
  title: string
  upload: string
}

interface MediaLibraryModalProps {
  folderPrefix?: string
  isOpen: boolean
  labels: MediaLibraryLabels
  onClose: () => void
  onSelect: (asset: AdminMediaAsset) => void
}

export function MediaLibraryModal({
  folderPrefix,
  isOpen,
  labels,
  onClose,
  onSelect,
}: MediaLibraryModalProps) {
  const { data: assets = [], isLoading } = useAdminMediaAssets(folderPrefix)
  const uploadMutation = useUploadAdminMediaAsset(folderPrefix ?? 'settings')
  const deleteMutation = useDeleteAdminMediaAsset()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setErrorMessage(null)
    uploadMutation.mutate(
      {
        alt: file.name,
        file,
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error ? error.message : 'Не удалось загрузить файл',
          )
        },
      },
    )
    event.target.value = ''
  }

  return (
    <Modal isOpen={isOpen} size="xl" title={labels.title} onClose={onClose}>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer">
            <input
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleUpload}
            />
            <span className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
              {uploadMutation.isPending ? labels.upload + '...' : labels.upload}
            </span>
          </label>
          {uploadMutation.isPending ? <Loader size="sm" /> : null}
        </div>
        {errorMessage ? (
          <Typography className="text-red-600" variant="body-sm">
            {errorMessage}
          </Typography>
        ) : null}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : null}
        {!isLoading && assets.length === 0 ? (
          <Typography className="text-slate-500" variant="body-sm">
            {labels.empty}
          </Typography>
        ) : null}
        {!isLoading && assets.length > 0 ? (
          <div className="grid max-h-[28rem] gap-3 overflow-x-hidden overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <article
                className="grid min-w-0 gap-2 rounded-lg border border-slate-200 p-2"
                key={asset.id}
              >
                <img
                  alt={asset.alt}
                  className="h-32 w-full rounded-md bg-slate-50 object-contain"
                  src={asset.publicUrl}
                />
                <Typography className="truncate text-slate-600" variant="caption">
                  {asset.alt}
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      onSelect(asset)
                      onClose()
                    }}
                  >
                    {labels.choose}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!window.confirm('Удалить изображение из хранилища?')) {
                        return
                      }

                      setErrorMessage(null)
                      deleteMutation.mutate(asset.id, {
                        onError: (error) => {
                          setErrorMessage(
                            error instanceof Error
                              ? error.message
                              : 'Не удалось удалить файл',
                          )
                        },
                      })
                    }}
                  >
                    {labels.delete}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {labels.close}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
