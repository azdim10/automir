import { useState, type ReactNode } from 'react'

import { cn } from '@shared/lib/styles/cn'
import { Container, Modal, Typography } from '@shared/ui'

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
    <p className="text-xs leading-5 text-slate-800">
      <span className="font-bold">{label}</span> {children}
    </p>
  )
}

function FooterCertificate({
  alt,
  labels,
  url,
}: {
  alt: string
  labels: FooterLabels
  url: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex w-full flex-col items-center gap-1.5 lg:items-end">
        <p className="w-full text-center text-xs font-bold text-slate-800 lg:text-right">
          {labels.certificate}
        </p>
        <button
          className="group cursor-zoom-in border-0 bg-transparent p-0"
          type="button"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <img
            alt={alt}
            className="h-auto w-[5.5rem] bg-white object-contain shadow-[0_0_0_1px_rgba(255,255,255,0.9)] transition group-hover:opacity-90 sm:w-[6.25rem]"
            src={url}
          />
        </button>
      </div>
      <Modal
        closeOnOverlayClick
        contentClassName="max-h-[calc(100vh-2rem)] overflow-auto bg-transparent p-0 shadow-none"
        isOpen={isOpen}
        size="full"
        onClose={() => {
          setIsOpen(false)
        }}
      >
        <img
          alt={alt}
          className="mx-auto max-h-[calc(100vh-2rem)] w-auto max-w-full object-contain"
          src={url}
        />
      </Modal>
    </>
  )
}

export function AppFooter({ labels, settings }: AppFooterProps) {
  const hasCertificate = Boolean(settings.certificateUrl)

  return (
    <footer className="relative overflow-hidden bg-[#E6F2FF]">
      {settings.backgroundUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url("${settings.backgroundUrl}")`,
          }}
        />
      ) : null}
      <Container className="relative">
        <div
          className={cn(
            'grid items-start gap-6 py-6 sm:gap-8 sm:py-7',
            hasCertificate
              ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:gap-10'
              : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12',
          )}
        >
          <div className="grid gap-1">
            <Typography
              className="text-xs leading-5 text-slate-800"
              variant="caption"
            >
              {settings.copyright}
            </Typography>
            <Typography
              className="text-xs leading-5 text-slate-800"
              variant="caption"
            >
              {settings.companyName}
            </Typography>
          </div>
          <div className="grid gap-1">
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
                      className="text-slate-800 hover:text-slate-950"
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
                      className="text-slate-800 hover:text-slate-950"
                      href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    >
                      {phone}
                    </a>
                  </span>
                ))}
              </FooterContactLine>
            ) : null}
          </div>
          {hasCertificate ? (
            <div className="justify-self-center lg:justify-self-end">
              <FooterCertificate
                alt={settings.certificateAlt}
                labels={labels}
                url={settings.certificateUrl ?? ''}
              />
            </div>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}

export function AppFooterSkeleton() {
  return (
    <footer className="bg-[#E6F2FF]">
      <Container>
        <div className="grid gap-6 py-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:gap-10">
          <div className="grid gap-2">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-48 animate-pulse rounded bg-slate-300/70" />
          </div>
          <div className="grid gap-2">
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-full max-w-sm animate-pulse rounded bg-slate-300/70" />
          </div>
          <div className="mx-auto grid justify-items-center gap-2 lg:mx-0 lg:justify-items-end">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-300/70" />
            <div className="h-28 w-[5.5rem] animate-pulse rounded bg-slate-300/70" />
          </div>
        </div>
      </Container>
    </footer>
  )
}
