import { Link } from 'react-router'

import { Container, Typography } from '@shared/ui'

import type { WelcomeSectionPayload } from '../model/homeSection.types'

interface WelcomeSectionProps {
  payload: WelcomeSectionPayload
}

function resolveActionHref(href: string) {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href
  }

  return href.startsWith('/') ? href : `/${href}`
}

export function WelcomeSection({ payload }: WelcomeSectionProps) {
  const primaryAction = payload.actions?.[0]

  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-12 md:py-16">
      <Container>
        <div className="grid gap-8">
          <Typography
            as="h1"
            className="text-center text-sky-900 md:text-left"
            variant="h1"
            weight="bold"
          >
            {payload.title}
          </Typography>
          <div className="grid gap-6 md:grid-cols-2">
            {payload.descriptionLeft ? (
              <Typography
                className="whitespace-pre-line text-slate-700"
                variant="body"
              >
                {payload.descriptionLeft}
              </Typography>
            ) : null}
            {payload.descriptionRight ? (
              <Typography
                className="whitespace-pre-line text-slate-700"
                variant="body"
              >
                {payload.descriptionRight}
              </Typography>
            ) : null}
          </div>
          {primaryAction ? (
            <div className="flex justify-center md:justify-start">
              {primaryAction.href.startsWith('http') ? (
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-800 px-8 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-slate-700"
                  href={primaryAction.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {primaryAction.label}
                </a>
              ) : (
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-800 px-8 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-slate-700"
                  to={resolveActionHref(primaryAction.href)}
                >
                  {primaryAction.label}
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
