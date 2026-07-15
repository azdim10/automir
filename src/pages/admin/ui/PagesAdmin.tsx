import { useState, type SyntheticEvent } from 'react'

import {
  parseContentSectionPayload,
  parseFeaturedSectionPayload,
  parseWelcomeSectionPayload,
  type AdminInfoPageRecord,
  type SaveAdminInfoPageInput,
} from '@entities/admin/api/adminRepository'
import {
  defaultMediaImageFieldLabels,
  MediaImageField,
} from '@features/media-library'
import {
  MANAGED_INFO_PAGE_SLUGS,
  type ManagedInfoPageSlug,
} from '@entities/content/model/managedPages'
import type { TableRow } from '@shared/api/supabase'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Typography,
} from '@shared/ui'

const MAX_HOME_FEATURED_PRODUCTS = 12

interface PagesAdminLabels {
  aboutPage: string
  catalogAction: string
  contactsPage: string
  deliveryPage: string
  descriptionLeft: string
  descriptionRight: string
  featuredDetailsLabel: string
  featuredProducts: string
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
  featuredProductIds: string[]
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
  products: TableRow<'products'>[]
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
    featuredProductIds: [],
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
      featuredProductIds: featuredPayload.featuredProductIds,
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
    featuredProductIds: [],
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
  products: TableRow<'products'>[]
}

function PagesAdminForm({
  errorMessage,
  initialForm,
  labels,
  onSave,
  products,
}: PagesAdminFormProps) {
  const [form, setForm] = useState(initialForm)
  const isContactsPage = form.slug === 'contacts'
  const isHomePage = form.slug === 'home'

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      catalogActionLabel: form.catalogActionLabel,
      descriptionLeft: form.descriptionLeft,
      descriptionRight: form.descriptionRight,
      featuredDetailsLabel: form.featuredDetailsLabel,
      featuredProductIds: form.featuredProductIds,
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
            <div className="grid gap-2">
              <Typography as="h4" variant="body-sm" weight="semibold">
                {labels.featuredProducts}
              </Typography>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-3">
                {products.length === 0 ? (
                  <Typography className="text-slate-500" variant="body-sm">
                    {labels.featuredProducts}
                  </Typography>
                ) : (
                  products.map((product) => {
                    const isChecked = form.featuredProductIds.includes(
                      product.id,
                    )

                    return (
                      <label
                        className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-1 hover:bg-slate-50"
                        key={product.id}
                      >
                        <input
                          checked={isChecked}
                          className="mt-1"
                          type="checkbox"
                          onChange={() => {
                            if (isChecked) {
                              setForm({
                                ...form,
                                featuredProductIds:
                                  form.featuredProductIds.filter(
                                    (id) => id !== product.id,
                                  ),
                              })
                              return
                            }

                            if (
                              form.featuredProductIds.length >=
                              MAX_HOME_FEATURED_PRODUCTS
                            ) {
                              return
                            }

                            setForm({
                              ...form,
                              featuredProductIds: [
                                ...form.featuredProductIds,
                                product.id,
                              ],
                            })
                          }}
                        />
                        <span className="text-sm text-slate-700">
                          {product.name}
                          <span className="block text-slate-500">
                            {product.sku}
                          </span>
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
            </div>
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
          <MediaImageField
            alt={form.imageAlt}
            altLabel={labels.pageImageAlt}
            file={form.imageFile}
            folderPrefix={`pages/${form.slug}`}
            imageClassName="h-40 w-full max-w-xl rounded-lg object-cover object-left"
            labels={defaultMediaImageFieldLabels}
            url={form.imageUrl}
            onAltChange={(value) => {
              setForm((current) => ({ ...current, imageAlt: value }))
            }}
            onClear={() => {
              setForm((current) => ({
                ...current,
                imageFile: null,
                imageUrl: '',
              }))
            }}
            onFileChange={(file) => {
              setForm((current) => ({ ...current, imageFile: file }))
            }}
            onLibrarySelect={(asset) => {
              setForm((current) => ({
                ...current,
                imageAlt: current.imageAlt || asset.alt,
                imageFile: null,
                imageUrl: asset.publicUrl,
              }))
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
  products,
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
          products={products}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  )
}
