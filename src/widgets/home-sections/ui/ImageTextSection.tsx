import { Container, Typography } from '@shared/ui'

import type { ImageTextSectionPayload } from '../model/homeSection.types'
import { HomeSectionActions } from './HomeSectionActions'

interface ImageTextSectionProps {
  payload: ImageTextSectionPayload
}

export function ImageTextSection({ payload }: ImageTextSectionProps) {
  const image = (
    <img
      className="aspect-[4/3] w-full rounded-2xl object-cover"
      src={payload.image.url}
      alt={payload.image.alt}
    />
  )

  const content = (
    <div className="grid content-center gap-4">
      <Typography as="h2" variant="h2" weight="bold">
        {payload.title}
      </Typography>
      {payload.description ? (
        <Typography className="text-slate-600" variant="body">
          {payload.description}
        </Typography>
      ) : null}
      <HomeSectionActions actions={payload.actions} />
    </div>
  )

  return (
    <section className="py-10">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2">
          {payload.imagePosition === 'left' ? image : content}
          {payload.imagePosition === 'left' ? content : image}
        </div>
      </Container>
    </section>
  )
}
