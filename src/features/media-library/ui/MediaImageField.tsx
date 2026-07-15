import { useEffect, useMemo, useState } from 'react'

import type { AdminMediaAsset } from '@entities/admin'
import { Button, Input, Typography } from '@shared/ui'

import type { MediaLibraryLabels } from './MediaLibraryModal'
import { MediaLibraryModal } from './MediaLibraryModal'

export interface MediaImageFieldLabels extends MediaLibraryLabels {
  alt: string
  clear: string
  openLibrary: string
  upload: string
}

interface MediaImageFieldProps {
  alt: string
  altLabel: string
  file: File | null
  folderPrefix: string
  imageClassName?: string
  labels: MediaImageFieldLabels
  onAltChange: (value: string) => void
  onClear: () => void
  onFileChange: (file: File | null) => void
  onLibrarySelect: (asset: AdminMediaAsset) => void
  url: string
}

export function MediaImageField({
  alt,
  altLabel,
  file,
  folderPrefix,
  imageClassName = 'h-40 w-full max-w-xl rounded-lg object-contain object-left',
  labels,
  onAltChange,
  onClear,
  onFileChange,
  onLibrarySelect,
  url,
}: MediaImageFieldProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const previewSource = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return url.trim().length > 0 ? url : null
  }, [file, url])

  useEffect(() => {
    if (!file || !previewSource) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewSource)
    }
  }, [file, previewSource])

  return (
    <div className="grid gap-3">
      {previewSource ? (
        <img alt={alt} className={imageClassName} src={previewSource} />
      ) : null}
      <Input
        placeholder={altLabel}
        value={alt}
        onChange={(event) => {
          onAltChange(event.target.value)
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsLibraryOpen(true)
          }}
        >
          {labels.openLibrary}
        </Button>
        <label className="inline-flex cursor-pointer">
          <input
            accept="image/*"
            className="hidden"
            type="file"
            onChange={(event) => {
              onFileChange(event.target.files?.[0] ?? null)
            }}
          />
          <span className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
            {labels.upload}
          </span>
        </label>
        {previewSource ? (
          <Button type="button" variant="ghost" onClick={onClear}>
            {labels.clear}
          </Button>
        ) : null}
      </div>
      {url ? (
        <Typography className="truncate text-slate-500" variant="caption">
          {url}
        </Typography>
      ) : null}
      <MediaLibraryModal
        folderPrefix={folderPrefix}
        isOpen={isLibraryOpen}
        labels={labels}
        onClose={() => {
          setIsLibraryOpen(false)
        }}
        onSelect={(asset) => {
          onLibrarySelect(asset)
        }}
      />
    </div>
  )
}
