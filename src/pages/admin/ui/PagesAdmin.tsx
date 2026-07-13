import { useEffect, useMemo, useState, type SyntheticEvent } from 'react'

import {
  parseContentSectionPayload,
  parseFeaturedSectionPayload,
  parseWelcomeSectionPayload,
  type AdminInfoPageRecord,
  type SaveAdminInfoPageInput,
} from '@entities/admin/api/adminRepository'
import {
  MANAGED_INFO_PAGE_SLUGS,
  type ManagedInfoPageSlug,
} from '@entities/content/model/managedPages'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Typography,
} from '@shared/ui'

interface PagesAdminLabels {
  aboutPage: string
  catalogAction: string
  contactsPage: string
  deliveryPage: string
  descriptionLeft: string
  descriptionRight: string
  featuredDetailsLabel: string
  featuredLimit: string
  featuredTitle: string
  homePage: string
  mapLatitude: string
  mapLongitude: string
  mapTitle: string
  mapZoom: string
  pageImage: string
  pageImageAlt: string
  pageMetaDescription: string
  pageMetaTitle: string
  pageTitle: string
  pages: string
  save: string
  sectionText: string
  warrantyPage: string
}

export interface InfoPageFormState {
  catalogActionLabel: string
  descriptionLeft: string
  descriptionRight: string
  featuredDetailsLabel: string
  featuredLimit: string
  featuredSectionId: string | null
  featuredTitle: string
  imageAlt: string
  imageFile: File | null
  imageUrl: string
  mapLatitude: string
  mapLongitude: string
  mapTitle: string
  mapZoom: string
  metaDescription: string
  metaTitle: string
  sectionId: string | null
  sectionText: string
  slug: ManagedInfoPageSlug
  title: string
}

interface PagesAdminProps {
  errorMessage: string | null
  infoPages: AdminInfoPageRecord[]
  labels: PagesAdminLabels
  onSave: (input: SaveAdminInfoPageInput) => void
}

const PAGE_LABEL_KEYS: Record<
  ManagedInfoPageSlug,
  keyof Pick<
    PagesAdminLabels,
    | 'aboutPage'
    | 'contactsPage'
    | 'deliveryPage'
    | 'homePage'
    | 'warrantyPage'
  >
> = {
  about: 'aboutPage',
  contacts: 'contactsPage',
  delivery: 'deliveryPage',
  home: 'homePage',
  warranty: 'warrantyPage',
}

function createEmptyInfoPageForm(slug: ManagedInfoPageSlug): InfoPageFormState {
  return {
    catalogActionLabel: '',
    descriptionLeft: '',
    descriptionRight: '',
    featuredDetailsLabel: 'Подробнее >>',
    featuredLimit: '6',
    featuredSectionId: null,
    featuredTitle: '',
    imageAlt: '',
    imageFile: null,
    imageUrl: '',
    mapLatitude: '',
    mapLongitude: '',
    mapTitle: '',
    mapZoom: '16',
    metaDescription: '',
    metaTitle: '',
    sectionId: null,
    sectionText: '',
    slug,
    title: '',
  }
}

function createInfoPageForm(
  slug: ManagedInfoPageSlug,
  record: AdminInfoPageRecord | undefined,
): InfoPageFormState {
  if (!record?.page.id) {
    return createEmptyInfoPageForm(slug)
  }

  if (slug === 'home') {
    const welcomePayload = parseWelcomeSectionPayload(record.section?.payload)
    const featuredPayload = parseFeaturedSectionPayload(
      record.secondarySection?.payload,
    )

    return {
      catalogActionLabel: welcomePayload.catalogActionLabel,
      descriptionLeft: welcomePayload.descriptionLeft,
      descriptionRight: welcomePayload.descriptionRight,
      featuredDetailsLabel: featuredPayload.featuredDetailsLabel,
      featuredLimit: featuredPayload.featuredLimit,
      featuredSectionId: record.secondarySection?.id ?? null,
      featuredTitle: featuredPayload.featuredTitle,
      imageAlt: '',
      imageFile: null,
      imageUrl: '',
      mapLatitude: '',
      mapLongitude: '',
      mapTitle: '',
      mapZoom: '16',
      metaDescription: record.page.meta_description ?? '',
      metaTitle: record.page.meta_title ?? record.page.title,
      sectionId: record.section?.id ?? null,
      sectionText: '',
      slug,
      title: record.page.title || welcomePayload.title,
    }
  }

  const sectionPayload = parseContentSectionPayload(record.section?.payload)

  return {
    catalogActionLabel: '',
    descriptionLeft: '',
    descriptionRight: '',
    featuredDetailsLabel: 'Подробнее >>',
    featuredLimit: '6',
    featuredSectionId: null,
    featuredTitle: '',
    imageAlt: sectionPayload.imageAlt,
    imageFile: null,
    imageUrl: sectionPayload.imageUrl,
    mapLatitude: sectionPayload.mapLatitude,
    mapLongitude: sectionPayload.mapLongitude,
    mapTitle: sectionPayload.mapTitle,
    mapZoom: sectionPayload.mapZoom,
    metaDescription: record.page.meta_description ?? '',
    metaTitle: record.page.meta_title ?? record.page.title,
    sectionId: record.section?.id ?? null,
    sectionText: sectionPayload.sectionText,
    slug,
    title: record.page.title || sectionPayload.title,
  }
}

interface PagesAdminFormProps {
  errorMessage: string | null
  initialForm: InfoPageFormState
  labels: PagesAdminLabels
  onSave: (input: SaveAdminInfoPageInput) => void
}

function PagesAdminForm({
  errorMessage,
  initialForm,
  labels,
  onSave,
}: PagesAdminFormProps) {
  const [form, setForm] = useState(initialForm)
  const isContactsPage = form.slug === 'contacts'
  const isHomePage = form.slug === 'home'

  const selectedLogoPreview = useMemo(() => {
    if (!form.imageFile) {
      return null
    }

    return URL.createObjectURL(form.imageFile)
  }, [form.imageFile])

  useEffect(() => {
    return () => {
      if (selectedLogoPreview) {
        URL.revokeObjectURL(selectedLogoPreview)
      }
    }
  }, [selectedLogoPreview])

  const imagePreviewSource =
    selectedLogoPreview ??
    (form.imageUrl.trim().length > 0 ? form.imageUrl : null)

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      catalogActionLabel: form.catalogActionLabel,
      descriptionLeft: form.descriptionLeft,
      descriptionRight: form.descriptionRight,
      featuredDetailsLabel: form.featuredDetailsLabel,
      featuredLimit: form.featuredLimit,
      featuredSectionId: form.featuredSectionId,
      featuredTitle: form.featuredTitle,
      imageAlt: form.imageAlt,
      imageFile: form.imageFile,
      imageUrl: form.imageUrl,
      mapLatitude: form.mapLatitude,
      mapLongitude: form.mapLongitude,
      mapTitle: form.mapTitle,
      mapZoom: form.mapZoom,
      metaDescription: form.metaDescription,
      metaTitle: form.metaTitle,
      sectionId: form.sectionId,
      sectionText: form.sectionText,
      slug: form.slug,
      title: form.title,
    })
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
      <Input
        required
        placeholder={labels.pageTitle}
        value={form.title}
        onChange={(event) => {
          setForm({ ...form, title: event.target.value })
        }}
      />
      <Input
        placeholder={labels.pageMetaTitle}
        value={form.metaTitle}
        onChange={(event) => {
          setForm({ ...form, metaTitle: event.target.value })
        }}
      />
      <Input
        placeholder={labels.pageMetaDescription}
        value={form.metaDescription}
        onChange={(event) => {
          setForm({ ...form, metaDescription: event.target.value })
        }}
      />
      {isHomePage ? (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-medium">{labels.descriptionLeft}</span>
            <textarea
              className="min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder={labels.descriptionLeft}
              value={form.descriptionLeft}
              onChange={(event) => {
                setForm({ ...form, descriptionLeft: event.target.value })
              }}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">
              {labels.descriptionRight}
            </span>
            <textarea
              className="min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder={labels.descriptionRight}
              value={form.descriptionRight}
              onChange={(event) => {
                setForm({ ...form, descriptionRight: event.target.value })
              }}
            />
          </label>
          <Input
            placeholder={labels.catalogAction}
            value={form.catalogActionLabel}
            onChange={(event) => {
              setForm({ ...form, catalogActionLabel: event.target.value })
            }}
          />
          <div className="grid gap-3 rounded-lg border border-slate-200 p-4">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.featuredTitle}
            </Typography>
            <Input
              placeholder={labels.featuredTitle}
              value={form.featuredTitle}
              onChange={(event) => {
                setForm({ ...form, featuredTitle: event.target.value })
              }}
            />
            <Input
              placeholder={labels.featuredDetailsLabel}
              value={form.featuredDetailsLabel}
              onChange={(event) => {
                setForm({ ...form, featuredDetailsLabel: event.target.value })
              }}
            />
            <Input
              placeholder={labels.featuredLimit}
              type="number"
              value={form.featuredLimit}
              onChange={(event) => {
                setForm({ ...form, featuredLimit: event.target.value })
              }}
            />
          </div>
        </>
      ) : (
        <label className="grid gap-2">
          <span className="text-sm font-medium">{labels.sectionText}</span>
          <textarea
            className="min-h-40 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder={labels.sectionText}
            value={form.sectionText}
            onChange={(event) => {
              setForm({ ...form, sectionText: event.target.value })
            }}
          />
        </label>
      )}
      {isContactsPage ? (
        <div className="grid gap-3 rounded-lg border border-slate-200 p-4">
          <Typography as="h3" variant="body" weight="semibold">
            {labels.mapTitle}
          </Typography>
          <Input
            placeholder={labels.mapTitle}
            value={form.mapTitle}
            onChange={(event) => {
              setForm({ ...form, mapTitle: event.target.value })
            }}
          />
          <Input
            placeholder={labels.mapLatitude}
            step="any"
            type="number"
            value={form.mapLatitude}
            onChange={(event) => {
              setForm({ ...form, mapLatitude: event.target.value })
            }}
          />
          <Input
            placeholder={labels.mapLongitude}
            step="any"
            type="number"
            value={form.mapLongitude}
            onChange={(event) => {
              setForm({ ...form, mapLongitude: event.target.value })
            }}
          />
          <Input
            placeholder={labels.mapZoom}
            type="number"
            value={form.mapZoom}
            onChange={(event) => {
              setForm({ ...form, mapZoom: event.target.value })
            }}
          />
        </div>
      ) : null}
      {!isContactsPage && !isHomePage ? (
        <div className="grid gap-3">
          <Typography as="h3" variant="body" weight="semibold">
            {labels.pageImage}
          </Typography>
          {imagePreviewSource ? (
            <img
              alt={form.imageAlt}
              className="h-40 w-full max-w-xl rounded-lg object-cover object-left"
              src={imagePreviewSource}
            />
          ) : null}
          <Input
            placeholder={labels.pageImageAlt}
            value={form.imageAlt}
            onChange={(event) => {
              setForm({ ...form, imageAlt: event.target.value })
            }}
          />
          <Input
            accept="image/*"
            type="file"
            onChange={(event) => {
              setForm({
                ...form,
                imageFile: event.target.files?.[0] ?? null,
              })
            }}
          />
        </div>
      ) : null}
      <Button type="submit">{labels.save}</Button>
      {errorMessage ? (
        <Typography className="text-red-600" variant="body-sm">
          {errorMessage}
        </Typography>
      ) : null}
    </form>
  )
}

export function PagesAdmin({
  errorMessage,
  infoPages,
  labels,
  onSave,
}: PagesAdminProps) {
  const [selectedSlug, setSelectedSlug] =
    useState<ManagedInfoPageSlug>('home')

  const selectedRecord = infoPages.find(
    (record) => record.page.slug === selectedSlug,
  )
  const formKey = `${selectedSlug}-${selectedRecord?.page.updated_at ?? ''}-${selectedRecord?.section?.id ?? 'new'}-${selectedRecord?.secondarySection?.id ?? 'secondary'}`
  const initialForm = createInfoPageForm(selectedSlug, selectedRecord)

  return (
    <Card>
      <CardContent>
        <Typography as="h2" variant="h3" weight="semibold">
          {labels.pages}
        </Typography>
        <Select
          className="mt-4"
          value={selectedSlug}
          options={MANAGED_INFO_PAGE_SLUGS.map((slug) => ({
            value: slug,
            label: labels[PAGE_LABEL_KEYS[slug]],
          }))}
          onChange={(event) => {
            setSelectedSlug(event.target.value as ManagedInfoPageSlug)
          }}
        />
        <PagesAdminForm
          key={formKey}
          errorMessage={errorMessage}
          initialForm={initialForm}
          labels={labels}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  )
}
