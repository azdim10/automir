import { type Dispatch, type SetStateAction, type SyntheticEvent } from 'react'

import type {
  AdminProductImageRecord,
  AdminProductRecord,
  SaveAdminProductInput,
} from '@entities/admin/api/adminRepository'
import {
  defaultMediaImageFieldLabels,
  MediaImageField,
} from '@features/media-library'
import type { TableRow } from '@shared/api/supabase'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Typography,
} from '@shared/ui'

export interface ProductSpecificationFormRow {
  name: string
  value: string
}

export interface ProductModificationFormRow {
  applicability: string
  designation: string
  features: string
}

export interface ProductFormState {
  applicationArea: string
  categoryId: string
  description: string
  existingImages: AdminProductImageRecord[]
  id: string | null
  imageAlt: string
  imageAssetId: string | null
  imageFile: File | null
  imagePreviewUrl: string
  isActive: boolean
  isFeatured: boolean
  modifications: ProductModificationFormRow[]
  name: string
  packingNorm: string
  price: string
  productType: string
  sku: string
  sketchAlt: string
  sketchFile: File | null
  sketchUrl: string
  slug: string
  specifications: ProductSpecificationFormRow[]
  stockQuantity: string
}

interface ProductAdminLabels {
  active: string
  addProduct: string
  addRow: string
  applicationArea: string
  category: string
  delete: string
  description: string
  edit: string
  image: string
  imageAlt: string
  inactive: string
  modificationApplicability: string
  modificationDesignation: string
  modificationFeatures: string
  modifications: string
  name: string
  packingNorm: string
  price: string
  productType: string
  removeRow: string
  save: string
  sketch: string
  sketchAlt: string
  sku: string
  slug: string
  specificationName: string
  specifications: string
  specificationValue: string
  stock: string
}

interface ProductAdminFormProps {
  categories: TableRow<'categories'>[]
  errorMessage: string | null
  form: ProductFormState
  labels: ProductAdminLabels
  onDeleteImage?: (imageId: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
  setForm: Dispatch<SetStateAction<ProductFormState>>
}

function createEmptySpecificationRow(): ProductSpecificationFormRow {
  return { name: '', value: '' }
}

function createEmptyModificationRow(): ProductModificationFormRow {
  return { applicability: '', designation: '', features: '' }
}

export function createEmptyProductForm(): ProductFormState {
  return {
    applicationArea: '',
    categoryId: '',
    description: '',
    existingImages: [],
    id: null,
    imageAlt: '',
    imageAssetId: null,
    imageFile: null,
    imagePreviewUrl: '',
    isActive: true,
    isFeatured: false,
    modifications: [createEmptyModificationRow()],
    name: '',
    packingNorm: '',
    price: '',
    productType: '',
    sku: '',
    sketchAlt: '',
    sketchFile: null,
    sketchUrl: '',
    slug: '',
    specifications: [createEmptySpecificationRow()],
    stockQuantity: '0',
  }
}

export function createProductFormFromRecord(
  record: AdminProductRecord,
): ProductFormState {
  const { modifications, product, specifications } = record

  return {
    applicationArea: product.application_area ?? '',
    categoryId: product.category_id,
    description: product.description ?? '',
    existingImages: record.images,
    id: product.id,
    imageAlt: product.name,
    imageAssetId: null,
    imageFile: null,
    imagePreviewUrl: '',
    isActive: product.is_active,
    isFeatured: product.is_featured,
    modifications:
      modifications.length > 0
        ? modifications.map((item) => ({
            applicability: item.applicability,
            designation: item.designation,
            features: item.features,
          }))
        : [createEmptyModificationRow()],
    name: product.name,
    packingNorm: product.packing_norm ?? '',
    price: String(product.price),
    productType: product.product_type ?? '',
    sku: product.sku,
    sketchAlt: product.sketch_alt ?? product.name,
    sketchFile: null,
    sketchUrl: product.sketch_url ?? '',
    slug: product.slug,
    specifications:
      specifications.length > 0
        ? specifications.map((item) => ({
            name: item.name,
            value: item.value,
          }))
        : [createEmptySpecificationRow()],
    stockQuantity: String(product.stock_quantity),
  }
}

export function mapProductFormToSaveInput(
  form: ProductFormState,
): SaveAdminProductInput {
  return {
    applicationArea: form.applicationArea,
    categoryId: form.categoryId,
    description: form.description,
    id: form.id,
    imageAlt: form.imageAlt,
    imageAssetId: form.imageAssetId,
    imageFile: form.imageFile,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    modifications: form.modifications,
    name: form.name,
    packingNorm: form.packingNorm,
    price: Number(form.price),
    productType: form.productType,
    sku: form.sku,
    sketchAlt: form.sketchAlt,
    sketchFile: form.sketchFile,
    sketchUrl: form.sketchUrl,
    slug: form.slug,
    specifications: form.specifications,
    stockQuantity: Number(form.stockQuantity),
  }
}

export function ProductAdminForm({
  categories,
  errorMessage,
  form,
  labels,
  onDeleteImage,
  onSubmit,
  setForm,
}: ProductAdminFormProps) {
  return (
    <Card>
      <CardContent>
        <Typography as="h2" variant="h3" weight="semibold">
          {labels.addProduct}
        </Typography>
        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <Input
            required
            placeholder={labels.name}
            value={form.name}
            onChange={(event) => {
              setForm({ ...form, name: event.target.value })
            }}
          />
          <Input
            required
            placeholder={labels.slug}
            value={form.slug}
            onChange={(event) => {
              setForm({ ...form, slug: event.target.value })
            }}
          />
          <Input
            required
            placeholder={labels.sku}
            value={form.sku}
            onChange={(event) => {
              setForm({ ...form, sku: event.target.value })
            }}
          />
          <Select
            required
            value={form.categoryId}
            options={[
              { value: '', label: labels.category },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            onChange={(event) => {
              setForm({ ...form, categoryId: event.target.value })
            }}
          />
          <Input
            required
            placeholder={labels.price}
            type="number"
            value={form.price}
            onChange={(event) => {
              setForm({ ...form, price: event.target.value })
            }}
          />
          <Input
            required
            placeholder={labels.stock}
            type="number"
            value={form.stockQuantity}
            onChange={(event) => {
              setForm({ ...form, stockQuantity: event.target.value })
            }}
          />
          <Input
            placeholder={labels.productType}
            value={form.productType}
            onChange={(event) => {
              setForm({ ...form, productType: event.target.value })
            }}
          />
          <Input
            placeholder={labels.packingNorm}
            value={form.packingNorm}
            onChange={(event) => {
              setForm({ ...form, packingNorm: event.target.value })
            }}
          />
          <Input
            placeholder={labels.applicationArea}
            value={form.applicationArea}
            onChange={(event) => {
              setForm({ ...form, applicationArea: event.target.value })
            }}
          />
          <label className="grid gap-2">
            <span className="text-sm font-medium">{labels.description}</span>
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder={labels.description}
              value={form.description}
              onChange={(event) => {
                setForm({ ...form, description: event.target.value })
              }}
            />
          </label>
          <div className="grid gap-3 rounded-lg border border-slate-200 p-4">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.specifications}
            </Typography>
            {form.specifications.map((row, index) => (
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]" key={index}>
                <Input
                  placeholder={labels.specificationName}
                  value={row.name}
                  onChange={(event) => {
                    const specifications = [...form.specifications]
                    specifications[index] = {
                      ...row,
                      name: event.target.value,
                    }
                    setForm({ ...form, specifications })
                  }}
                />
                <Input
                  placeholder={labels.specificationValue}
                  value={row.value}
                  onChange={(event) => {
                    const specifications = [...form.specifications]
                    specifications[index] = {
                      ...row,
                      value: event.target.value,
                    }
                    setForm({ ...form, specifications })
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const specifications = form.specifications.filter(
                      (_, rowIndex) => rowIndex !== index,
                    )
                    setForm({
                      ...form,
                      specifications:
                        specifications.length > 0
                          ? specifications
                          : [createEmptySpecificationRow()],
                    })
                  }}
                >
                  {labels.removeRow}
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm({
                  ...form,
                  specifications: [
                    ...form.specifications,
                    createEmptySpecificationRow(),
                  ],
                })
              }}
            >
              {labels.addRow}
            </Button>
          </div>
          <div className="grid gap-3 rounded-lg border border-slate-200 p-4">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.modifications}
            </Typography>
            {form.modifications.map((row, index) => (
              <div className="grid gap-2" key={index}>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    placeholder={labels.modificationDesignation}
                    value={row.designation}
                    onChange={(event) => {
                      const modifications = [...form.modifications]
                      modifications[index] = {
                        ...row,
                        designation: event.target.value,
                      }
                      setForm({ ...form, modifications })
                    }}
                  />
                  <Input
                    placeholder={labels.modificationFeatures}
                    value={row.features}
                    onChange={(event) => {
                      const modifications = [...form.modifications]
                      modifications[index] = {
                        ...row,
                        features: event.target.value,
                      }
                      setForm({ ...form, modifications })
                    }}
                  />
                  <Input
                    placeholder={labels.modificationApplicability}
                    value={row.applicability}
                    onChange={(event) => {
                      const modifications = [...form.modifications]
                      modifications[index] = {
                        ...row,
                        applicability: event.target.value,
                      }
                      setForm({ ...form, modifications })
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const modifications = form.modifications.filter(
                      (_, rowIndex) => rowIndex !== index,
                    )
                    setForm({
                      ...form,
                      modifications:
                        modifications.length > 0
                          ? modifications
                          : [createEmptyModificationRow()],
                    })
                  }}
                >
                  {labels.removeRow}
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm({
                  ...form,
                  modifications: [
                    ...form.modifications,
                    createEmptyModificationRow(),
                  ],
                })
              }}
            >
              {labels.addRow}
            </Button>
          </div>
          <div className="grid gap-3">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.image}
            </Typography>
            {form.existingImages.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {form.existingImages.map((image) => (
                  <article
                    className="grid gap-2 rounded-lg border border-slate-200 p-2"
                    key={image.id}
                  >
                    <img
                      alt={image.alt}
                      className="h-32 w-full rounded-md bg-slate-50 object-contain"
                      src={image.url}
                    />
                    <Typography className="truncate text-slate-600" variant="caption">
                      {image.alt}
                    </Typography>
                    {onDeleteImage ? (
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          onDeleteImage(image.id)
                        }}
                      >
                        {labels.delete}
                      </Button>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
            <MediaImageField
              alt={form.imageAlt}
              altLabel={labels.imageAlt}
              file={form.imageFile}
              folderPrefix="products"
              labels={defaultMediaImageFieldLabels}
              url={form.imagePreviewUrl}
              onAltChange={(value) => {
                setForm((current) => ({ ...current, imageAlt: value }))
              }}
              onClear={() => {
                setForm((current) => ({
                  ...current,
                  imageAssetId: null,
                  imageFile: null,
                  imagePreviewUrl: '',
                }))
              }}
              onFileChange={(file) => {
                setForm((current) => ({
                  ...current,
                  imageAssetId: null,
                  imageFile: file,
                  imagePreviewUrl: '',
                }))
              }}
              onLibrarySelect={(asset) => {
                setForm((current) => ({
                  ...current,
                  imageAlt: current.imageAlt || asset.alt,
                  imageAssetId: asset.id,
                  imageFile: null,
                  imagePreviewUrl: asset.publicUrl,
                }))
              }}
            />
          </div>
          <div className="grid gap-3">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.sketch}
            </Typography>
            <MediaImageField
              alt={form.sketchAlt}
              altLabel={labels.sketchAlt}
              file={form.sketchFile}
              folderPrefix="products"
              imageClassName="h-40 w-full max-w-xl rounded-lg object-contain object-left"
              labels={defaultMediaImageFieldLabels}
              url={form.sketchUrl}
              onAltChange={(value) => {
                setForm((current) => ({ ...current, sketchAlt: value }))
              }}
              onClear={() => {
                setForm((current) => ({
                  ...current,
                  sketchFile: null,
                  sketchUrl: '',
                }))
              }}
              onFileChange={(file) => {
                setForm((current) => ({
                  ...current,
                  sketchFile: file,
                  sketchUrl: '',
                }))
              }}
              onLibrarySelect={(asset) => {
                setForm((current) => ({
                  ...current,
                  sketchAlt: current.sketchAlt || asset.alt,
                  sketchFile: null,
                  sketchUrl: asset.publicUrl,
                }))
              }}
            />
          </div>
          <Select
            value={String(form.isActive)}
            options={[
              { value: 'true', label: labels.active },
              { value: 'false', label: labels.inactive },
            ]}
            onChange={(event) => {
              setForm({ ...form, isActive: event.target.value === 'true' })
            }}
          />
          <Button type="submit">{labels.save}</Button>
          {errorMessage ? (
            <Typography className="text-red-600" variant="body-sm">
              {errorMessage}
            </Typography>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}

interface ProductAdminListProps {
  errorMessage: string | null
  labels: Pick<ProductAdminLabels, 'delete' | 'edit'>
  products: AdminProductRecord[]
  onDelete: (id: string) => void
  onEdit: (record: AdminProductRecord) => void
}

export function ProductAdminList({
  errorMessage,
  labels,
  products,
  onDelete,
  onEdit,
}: ProductAdminListProps) {
  return (
    <div className="grid gap-3">
      {products.map((record) => (
        <Card key={record.product.id}>
          <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <Typography as="h3" variant="h3" weight="semibold">
                {record.product.name}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {record.product.sku} · {record.product.slug}
              </Typography>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onEdit(record)
                }}
              >
                {labels.edit}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(record.product.id)
                }}
              >
                {labels.delete}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {errorMessage ? (
        <Typography className="text-red-600" variant="body-sm">
          {errorMessage}
        </Typography>
      ) : null}
    </div>
  )
}
