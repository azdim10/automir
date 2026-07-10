import { Card, CardContent, Container, Typography } from '@shared/ui'

import type { FeatureGridSectionPayload } from '../model/homeSection.types'

interface FeatureGridSectionProps {
  payload: FeatureGridSectionPayload
}

export function FeatureGridSection({ payload }: FeatureGridSectionProps) {
  return (
    <section className="py-10">
      <Container>
        {payload.title || payload.description ? (
          <div className="mb-8 grid gap-3">
            {payload.title ? (
              <Typography as="h2" variant="h2" weight="bold">
                {payload.title}
              </Typography>
            ) : null}
            {payload.description ? (
              <Typography className="text-slate-600" variant="body">
                {payload.description}
              </Typography>
            ) : null}
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {payload.items.map((item) => {
            const content = (
              <Card className="h-full" padding="none">
                {item.image ? (
                  <img
                    className="aspect-video w-full rounded-t-lg object-cover"
                    src={item.image.url}
                    alt={item.image.alt}
                  />
                ) : null}
                <CardContent className="p-4">
                  <Typography as="h3" variant="h3" weight="semibold">
                    {item.title}
                  </Typography>
                  {item.description ? (
                    <Typography className="text-slate-600" variant="body-sm">
                      {item.description}
                    </Typography>
                  ) : null}
                </CardContent>
              </Card>
            )

            return item.href ? (
              <a className="block" href={item.href} key={item.title}>
                {content}
              </a>
            ) : (
              <div key={item.title}>{content}</div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
