import type { ReactNode } from 'react'

import { Container, Typography } from '@shared/ui'

import type { FooterLabels, FooterSettings } from '../model/footerSettings'

interface AppFooterProps {
  labels: FooterLabels
  settings: FooterSettings
}

function FooterContactLine({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <Typography className="text-slate-900" variant="body-sm">
      <span className="font-semibold">{label}</span> {children}
    </Typography>
  )
}

export function AppFooter({ labels, settings }: AppFooterProps) {
  const backgroundStyle = settings.backgroundUrl
    ? {
        backgroundImage: `url("${settings.backgroundUrl}")`,
      }
    : undefined

  return (
    <footer
      className="bg-cover bg-center bg-sky-100"
      style={backgroundStyle}
    >
      <Container>
        <div className="grid gap-6 px-2 py-8 md:grid-cols-2 md:gap-10">
          <div className="grid gap-2">
            <Typography className="text-slate-900" variant="body-sm">
              {settings.copyright}
            </Typography>
            <Typography className="text-slate-900" variant="body-sm">
              {settings.companyName}
            </Typography>
          </div>
          <div className="grid gap-2">
            {settings.address ? (
              <FooterContactLine label={labels.address}>
                {settings.address}
              </FooterContactLine>
            ) : null}
            {settings.emails.length > 0 ? (
              <FooterContactLine label={labels.email}>
                {settings.emails.map((email, index) => (
                  <span key={email}>
                    {index > 0 ? ' ' : null}
                    <a
                      className="text-slate-900 underline-offset-2 hover:underline"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </span>
                ))}
              </FooterContactLine>
            ) : null}
            {settings.phones.length > 0 ? (
              <FooterContactLine label={labels.phoneFax}>
                {settings.phones.map((phone, index) => (
                  <span key={phone}>
                    {index > 0 ? '; ' : null}
                    <a
                      className="text-slate-900 underline-offset-2 hover:underline"
                      href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    >
                      {phone}
                    </a>
                  </span>
                ))}
              </FooterContactLine>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export function AppFooterSkeleton() {
  return (
    <footer className="border-t border-slate-200 bg-sky-50">
      <Container>
        <div className="grid gap-4 py-8 md:grid-cols-2">
          <div className="h-12 animate-pulse rounded bg-slate-200" />
          <div className="h-20 animate-pulse rounded bg-slate-200" />
        </div>
      </Container>
    </footer>
  )
}
