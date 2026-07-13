import { Container, Typography } from '@shared/ui'

import type { ContentSectionPayload } from '../model/homeSection.types'

interface ContentSectionProps {
  payload: ContentSectionPayload
}

export function ContentSection({ payload }: ContentSectionProps) {
  return (
    <section className="py-10">
      <Container size="md">
        <div className="grid gap-6">
          <Typography as="h1" variant="h1" weight="bold">
            {payload.title}
          </Typography>
          {payload.image ? (
            <img
              className="w-full rounded-2xl object-cover"
              src={payload.image.url}
              alt={payload.image.alt}
            />
          ) : null}
          {payload.description ? (
            <Typography className="whitespace-pre-line text-slate-600" variant="body">
              {payload.description}
            </Typography>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
