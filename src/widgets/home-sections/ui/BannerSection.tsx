import { Container, Typography } from '@shared/ui'

import type { BannerSectionPayload } from '../model/homeSection.types'
import { HomeSectionActions } from './HomeSectionActions'

interface BannerSectionProps {
  payload: BannerSectionPayload
}

export function BannerSection({ payload }: BannerSectionProps) {
  return (
    <section className="py-8">
      <Container>
        <div className="grid overflow-hidden rounded-2xl bg-slate-100 md:grid-cols-2">
          <div className="grid content-center gap-4 p-6 md:p-10">
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
          {payload.image ? (
            <img
              className="h-full min-h-64 w-full object-cover"
              src={payload.image.url}
              alt={payload.image.alt}
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
