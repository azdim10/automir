import { usePageContent, useSiteSettings } from '@entities/content'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  Card,
  CardContent,
  Container,
  EmptyState,
  Skeleton,
  Typography,
  YandexMapEmbed,
} from '@shared/ui'
import { parseContentPayload } from '@widgets/home-sections/model/homeSectionPayload'

interface ContactsLabels {
  address: string
  email: string
  empty: string
  max: string
  phone: string
  socialLinks: string
  telegram: string
  title: string
  vk: string
  whatsapp: string
}

interface ContactField {
  href: string | null
  label: string
  value: string
}

function parseContactsLabels(value: Json | undefined): ContactsLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const keys: (keyof ContactsLabels)[] = [
    'address',
    'email',
    'empty',
    'max',
    'phone',
    'socialLinks',
    'telegram',
    'title',
    'vk',
    'whatsapp',
  ]
  const labels: Partial<ContactsLabels> = {}

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as ContactsLabels
}

function ContactsPageSkeleton() {
  return (
    <main className="py-10">
      <Container size="md">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="mt-8 grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <Skeleton className="h-24" />
        </div>
      </Container>
    </main>
  )
}

export function ContactsPage() {
  const { data: siteSettings } = useSiteSettings()
  const { data: pageContent, isLoading } = usePageContent('contacts')
  const labels = parseContactsLabels(siteSettings?.contacts_labels)
  const siteProfile = isJsonRecord(siteSettings?.site_profile)
    ? siteSettings.site_profile
    : undefined
  const socialLinks = isJsonRecord(siteSettings?.social_links)
    ? siteSettings.social_links
    : undefined

  if (!labels || isLoading) {
    return <ContactsPageSkeleton />
  }

  const contentSection = pageContent?.sections.find(
    (section) => section.type === 'content',
  )
  const contentPayload = contentSection
    ? parseContentPayload(contentSection.payload)
    : null

  const pageTitle = contentPayload?.title ?? labels.title
  const pageDescription = contentPayload?.description ?? ''
  const map = contentPayload?.map ?? null

  const contactFields: ContactField[] = [
    {
      label: labels.phone,
      value: siteProfile ? (getJsonString(siteProfile, 'phone') ?? '') : '',
      href: siteProfile
        ? `tel:${getJsonString(siteProfile, 'phone') ?? ''}`
        : null,
    },
    {
      label: labels.email,
      value: siteProfile ? (getJsonString(siteProfile, 'email') ?? '') : '',
      href: siteProfile
        ? `mailto:${getJsonString(siteProfile, 'email') ?? ''}`
        : null,
    },
    {
      label: labels.address,
      value: siteProfile ? (getJsonString(siteProfile, 'address') ?? '') : '',
      href: null,
    },
  ].filter((field) => field.value.length > 0)

  const socialFields: ContactField[] = [
    {
      label: labels.telegram,
      value: socialLinks ? (getJsonString(socialLinks, 'telegram') ?? '') : '',
      href: socialLinks ? (getJsonString(socialLinks, 'telegram') ?? '') : null,
    },
    {
      label: labels.whatsapp,
      value: socialLinks ? (getJsonString(socialLinks, 'whatsapp') ?? '') : '',
      href: socialLinks ? (getJsonString(socialLinks, 'whatsapp') ?? '') : null,
    },
    {
      label: labels.max,
      value: socialLinks ? (getJsonString(socialLinks, 'max') ?? '') : '',
      href: socialLinks ? (getJsonString(socialLinks, 'max') ?? '') : null,
    },
    {
      label: labels.vk,
      value: socialLinks ? (getJsonString(socialLinks, 'vk') ?? '') : '',
      href: socialLinks ? (getJsonString(socialLinks, 'vk') ?? '') : null,
    },
  ].filter((field) => field.value.length > 0)

  const hasContactInfo =
    contactFields.length > 0 || socialFields.length > 0

  return (
    <main className="py-10">
      <Container size="md">
        <Typography as="h1" variant="h1" weight="bold">
          {pageTitle}
        </Typography>

        {pageDescription ? (
          <Typography className="mt-6 whitespace-pre-line text-slate-600" variant="body">
            {pageDescription}
          </Typography>
        ) : null}

        {map ? (
          <section className="mt-10 grid gap-4">
            <Typography
              as="h2"
              className="text-lg font-bold uppercase tracking-wide text-sky-800"
              variant="h3"
            >
              {map.title}
            </Typography>
            <YandexMapEmbed
              latitude={map.latitude}
              longitude={map.longitude}
              title={map.title}
              zoom={map.zoom}
            />
          </section>
        ) : null}

        <div className="mt-10 grid gap-4">
          {!hasContactInfo && !pageDescription && !map ? (
            <EmptyState title={labels.empty} />
          ) : null}

          {contactFields.map((field) => (
            <Card key={field.label}>
              <CardContent className="grid gap-1">
                <Typography className="text-slate-500" variant="body-sm">
                  {field.label}
                </Typography>
                {field.href ? (
                  <a
                    className="font-medium text-slate-900 hover:underline"
                    href={field.href}
                  >
                    {field.value}
                  </a>
                ) : (
                  <Typography variant="body">{field.value}</Typography>
                )}
              </CardContent>
            </Card>
          ))}

          {socialFields.length > 0 ? (
            <Card>
              <CardContent className="grid gap-3">
                <Typography as="h2" variant="h3" weight="semibold">
                  {labels.socialLinks}
                </Typography>
                <ul className="grid gap-2">
                  {socialFields.map((field) => (
                    <li key={field.label}>
                      {field.href ? (
                        <a
                          className="text-slate-900 hover:underline"
                          href={field.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {field.label}
                        </a>
                      ) : (
                        <span>{field.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </Container>
    </main>
  )
}
