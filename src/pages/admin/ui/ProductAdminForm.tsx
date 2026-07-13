import { useEffect, useMemo, type SyntheticEvent } from 'react'

import type {
  AdminProductRecord,
  SaveAdminProductInput,
} from '@entities/admin/api/adminRepository'
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
  id: string | null
  imageAlt: string
  imageFile: File | null
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
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
  setForm: (form: ProductFormState) => void
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
    id: null,
    imageAlt: '',
    imageFile: null,
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
    id: product.id,
    imageAlt: product.name,
    imageFile: null,
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

function ProductImagePreview({
  alt,
  file,
  url,
}: {
  alt: string
  file: File | null
  url: string
}) {
  const preview = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return url.trim().length > 0 ? url : null
  }, [file, url])

  useEffect(() => {
    if (!file || !preview) {
      return
    }

    return () => {
      URL.revokeObjectURL(preview)
    }
  }, [file, preview])

  if (!preview) {
    return null
  }

  return (
    <img
      alt={alt}
      className="h-40 w-full max-w-xl rounded-lg object-contain object-left"
      src={preview}
    />
  )
}

export function ProductAdminForm({
  categories,
  errorMessage,
  form,
  labels,
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
            <Input
              placeholder={labels.imageAlt}
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
          <div className="grid gap-3">
            <Typography as="h3" variant="body" weight="semibold">
              {labels.sketch}
            </Typography>
            <ProductImagePreview
              alt={form.sketchAlt}
              file={form.sketchFile}
              url={form.sketchUrl}
            />
            <Input
              placeholder={labels.sketchAlt}
              value={form.sketchAlt}
              onChange={(event) => {
                setForm({ ...form, sketchAlt: event.target.value })
              }}
            />
            <Input
              accept="image/*"
              type="file"
              onChange={(event) => {
                setForm({
                  ...form,
                  sketchFile: event.target.files?.[0] ?? null,
                })
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
  labels: Pick<ProductAdminLabels, 'delete' | 'save'>
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
                {labels.save}
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
