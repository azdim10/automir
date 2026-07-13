import { useEffect, useMemo, useState, type SyntheticEvent } from 'react'

import {
  parseContentSectionPayload,
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
  deliveryPage: string
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
  imageAlt: string
  imageFile: File | null
  imageUrl: string
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
  keyof Pick<PagesAdminLabels, 'aboutPage' | 'deliveryPage' | 'warrantyPage'>
> = {
  about: 'aboutPage',
  delivery: 'deliveryPage',
  warranty: 'warrantyPage',
}

function createEmptyInfoPageForm(slug: ManagedInfoPageSlug): InfoPageFormState {
  return {
    imageAlt: '',
    imageFile: null,
    imageUrl: '',
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

  const sectionPayload = parseContentSectionPayload(record.section?.payload)

  return {
    imageAlt: sectionPayload.imageAlt,
    imageFile: null,
    imageUrl: sectionPayload.imageUrl,
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
      imageAlt: form.imageAlt,
      imageFile: form.imageFile,
      imageUrl: form.imageUrl,
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
    useState<ManagedInfoPageSlug>('delivery')

  const selectedRecord = infoPages.find(
    (record) => record.page.slug === selectedSlug,
  )
  const formKey = `${selectedSlug}-${selectedRecord?.page.updated_at ?? ''}-${selectedRecord?.section?.id ?? 'new'}`
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
