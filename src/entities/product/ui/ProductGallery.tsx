import { useState } from 'react'

import { cn } from '@shared/lib/styles/cn'
import { Skeleton } from '@shared/ui'

import type { ProductImage } from '../model/product.types'

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null)
  const activeImage =
    images.find((image) => image.id === activeImageId) ?? images[0] ?? null

  if (!activeImage) {
    return <Skeleton className="aspect-square w-full rounded-2xl" />
  }

  return (
    <div className="grid gap-4">
      <img
        className="aspect-square w-full rounded-2xl object-cover"
        src={activeImage.url}
        alt={activeImage.alt}
      />
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const isActive = image.id === activeImage.id

            return (
              <button
                aria-label={image.alt}
                className={cn(
                  'overflow-hidden rounded-lg border transition-colors',
                  isActive ? 'border-slate-900' : 'border-slate-200',
                )}
                key={image.id}
                onClick={() => {
                  setActiveImageId(image.id)
                }}
                type="button"
              >
                <img
                  className="aspect-square w-full object-cover"
                  src={image.url}
                  alt={image.alt}
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
