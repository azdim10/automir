import { Container, Typography } from '@shared/ui'

import type { HeroSectionPayload } from '../model/homeSection.types'
import { HomeSectionActions } from './HomeSectionActions'

interface HeroSectionProps {
  payload: HeroSectionPayload
}

export function HeroSection({ payload }: HeroSectionProps) {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="grid gap-5">
            {payload.eyebrow ? (
              <Typography
                as="p"
                className="uppercase tracking-wide text-slate-500"
                variant="caption"
                weight="semibold"
              >
                {payload.eyebrow}
              </Typography>
            ) : null}
            <Typography as="h1" variant="display" weight="bold">
              {payload.title}
            </Typography>
            {payload.description ? (
              <Typography className="max-w-2xl text-slate-600" variant="body">
                {payload.description}
              </Typography>
            ) : null}
            <HomeSectionActions actions={payload.actions} />
          </div>
          {payload.image ? (
            <img
              className="aspect-[4/3] w-full rounded-2xl object-cover"
              src={payload.image.url}
              alt={payload.image.alt}
            />
          ) : null}
        </div>
      </Container>
    </section>
  )
}
