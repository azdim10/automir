import { useState, type ReactNode } from 'react'

import { cn } from '@shared/lib/styles/cn'
import { Container, Modal } from '@shared/ui'

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

function FooterCertificate({ alt, url }: { alt: string; url: string }) {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        aria-label={alt}
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
      <Modal
        closeOnOverlayClick
        contentClassName="relative max-h-[calc(100vh-2rem)] overflow-auto p-2"
        isOpen={isOpen}
        size="fit"
        onClose={closeModal}
      >
        <button
          aria-label="Закрыть"
          className="absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-slate-900/75 text-lg leading-none text-white transition hover:bg-slate-900"
          type="button"
          onClick={closeModal}
        >
          ×
        </button>
        <img
          alt={alt}
          className="block max-h-[calc(100vh-4rem)] w-auto max-w-[calc(100vw-4rem)] object-contain"
          src={url}
        />
      </Modal>
    </>
  )
}

export function AppFooter({ labels, settings }: AppFooterProps) {
  const hasCertificate = Boolean(settings.certificateUrl)
  const hasBackground = Boolean(settings.backgroundUrl)

  return (
    <footer className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white to-[#E6F2FF]"
      />
      {hasBackground && settings.backgroundUrl ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${settings.backgroundUrl}")`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-white via-[#E6F2FF]/80 to-[#E6F2FF]/95"
          />
        </>
      ) : null}
      <Container className="relative z-[1]">
        <div
          className={cn(
            'flex flex-col gap-5 py-5 sm:py-6',
            hasCertificate
              ? 'lg:flex-row lg:items-center lg:justify-between lg:gap-8'
              : 'lg:flex-row lg:items-center lg:justify-between lg:gap-12',
          )}
        >
          <div className="shrink-0 space-y-0.5 lg:max-w-[16rem]">
            <p className="text-xs leading-5 text-slate-800">{settings.copyright}</p>
            <p className="text-xs leading-5 text-slate-800">{settings.companyName}</p>
          </div>

          <div
            className={cn(
              'space-y-0.5',
              hasCertificate
                ? 'lg:flex-1 lg:px-6 xl:px-10'
                : 'lg:flex-1 lg:px-6',
            )}
          >
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
            <div className="flex shrink-0 justify-start lg:justify-end">
              <FooterCertificate
                alt={settings.certificateAlt}
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
    <footer className="bg-gradient-to-b from-white to-[#E6F2FF]">
      <Container>
        <div className="flex flex-col gap-5 py-5 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-48 animate-pulse rounded bg-slate-300/70" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-slate-300/70" />
            <div className="h-4 w-full max-w-sm animate-pulse rounded bg-slate-300/70" />
          </div>
          <div className="h-28 w-[5.5rem] shrink-0 animate-pulse rounded bg-slate-300/70" />
        </div>
      </Container>
    </footer>
  )
}
