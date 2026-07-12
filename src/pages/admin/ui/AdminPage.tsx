import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type SyntheticEvent } from 'react'

import {
  adminQueryKeys,
  createAdminCategory,
  createAdminProduct,
  deleteAdminCategory,
  deleteAdminProduct,
  getAdminCallbackRequests,
  getAdminCategories,
  getAdminOrders,
  getAdminProducts,
  updateAdminCallbackRequestStatus,
  updateAdminCategory,
  updateAdminOrderStatus,
  updateAdminProduct,
  uploadAdminProductImage,
  uploadAdminSiteLogo,
  upsertAdminSiteSetting,
} from '@entities/admin'
import { signInWithEmail, signOut, useAuthSession } from '@entities/auth'
import { categoryQueryKeys } from '@entities/category'
import { useSiteSettings } from '@entities/content'
import { contentQueryKeys } from '@entities/content'
import { productQueryKeys } from '@entities/product'
import type { Json, TableRow } from '@shared/api/supabase'
import { formatCurrency } from '@shared/lib/format'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  Button,
  Card,
  CardContent,
  Container,
  Input,
  Select,
  Skeleton,
  Typography,
} from '@shared/ui'

type AdminTab = 'products' | 'categories' | 'orders' | 'callbacks' | 'settings'

interface AdminLabels {
  active: string
  addCategory: string
  addProduct: string
  adminTitle: string
  callbacks: string
  category: string
  categories: string
  delete: string
  email: string
  image: string
  imageAlt: string
  inactive: string
  login: string
  logo: string
  logoAlt: string
  logout: string
  max: string
  name: string
  orders: string
  password: string
  price: string
  products: string
  save: string
  seoDescription: string
  seoKeywords: string
  seoTitle: string
  settings: string
  sku: string
  slug: string
  socialLinks: string
  status: string
  stock: string
  storeAddress: string
  storeName: string
  storePhone: string
  telegram: string
  vk: string
  whatsapp: string
}

interface ProductFormState {
  categoryId: string
  id: string | null
  imageAlt: string
  imageFile: File | null
  isActive: boolean
  isFeatured: boolean
  name: string
  price: string
  sku: string
  slug: string
  stockQuantity: string
}

interface CategoryFormState {
  id: string | null
  isActive: boolean
  name: string
  slug: string
}

interface SiteSettingsFormState {
  address: string
  email: string
  logoAlt: string
  logoFile: File | null
  logoUrl: string
  max: string
  seoDescription: string
  seoKeywords: string
  seoTitle: string
  storeName: string
  telegram: string
  phone: string
  vk: string
  whatsapp: string
}

function parseAdminLabels(value: Json | undefined): AdminLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const labels: Partial<AdminLabels> = {}
  const keys: (keyof AdminLabels)[] = [
    'active',
    'addCategory',
    'addProduct',
    'adminTitle',
    'callbacks',
    'category',
    'categories',
    'delete',
    'email',
    'image',
    'imageAlt',
    'inactive',
    'login',
    'logo',
    'logoAlt',
    'logout',
    'max',
    'name',
    'orders',
    'password',
    'price',
    'products',
    'save',
    'seoDescription',
    'seoKeywords',
    'seoTitle',
    'settings',
    'sku',
    'slug',
    'socialLinks',
    'status',
    'stock',
    'storeAddress',
    'storeName',
    'storePhone',
    'telegram',
    'vk',
    'whatsapp',
  ]

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as AdminLabels
}

function AdminSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="mt-8 grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </Container>
    </main>
  )
}

function createEmptyProductForm(): ProductFormState {
  return {
    categoryId: '',
    id: null,
    imageAlt: '',
    imageFile: null,
    isActive: true,
    isFeatured: false,
    name: '',
    price: '',
    sku: '',
    slug: '',
    stockQuantity: '0',
  }
}

function createEmptyCategoryForm(): CategoryFormState {
  return {
    id: null,
    isActive: true,
    name: '',
    slug: '',
  }
}

function createSettingsForm(
  siteSettings: Record<string, Json> | undefined,
): SiteSettingsFormState {
  const siteProfile = isJsonRecord(siteSettings?.site_profile)
    ? siteSettings.site_profile
    : undefined
  const socialLinks = isJsonRecord(siteSettings?.social_links)
    ? siteSettings.social_links
    : undefined
  const seoSettings = isJsonRecord(siteSettings?.seo_settings)
    ? siteSettings.seo_settings
    : undefined

  return {
    address: siteProfile ? (getJsonString(siteProfile, 'address') ?? '') : '',
    email: siteProfile ? (getJsonString(siteProfile, 'email') ?? '') : '',
    logoAlt: siteProfile ? (getJsonString(siteProfile, 'logoAlt') ?? '') : '',
    logoFile: null,
    logoUrl: siteProfile ? (getJsonString(siteProfile, 'logoUrl') ?? '') : '',
    max: socialLinks ? (getJsonString(socialLinks, 'max') ?? '') : '',
    phone: siteProfile ? (getJsonString(siteProfile, 'phone') ?? '') : '',
    seoDescription: seoSettings
      ? (getJsonString(seoSettings, 'description') ?? '')
      : '',
    seoKeywords: seoSettings
      ? (getJsonString(seoSettings, 'keywords') ?? '')
      : '',
    seoTitle: seoSettings ? (getJsonString(seoSettings, 'title') ?? '') : '',
    storeName: siteProfile
      ? (getJsonString(siteProfile, 'storeName') ?? '')
      : '',
    telegram: socialLinks ? (getJsonString(socialLinks, 'telegram') ?? '') : '',
    vk: socialLinks ? (getJsonString(socialLinks, 'vk') ?? '') : '',
    whatsapp: socialLinks ? (getJsonString(socialLinks, 'whatsapp') ?? '') : '',
  }
}

function getMutationErrorMessage(error: Error | null): string | null {
  return error?.message ?? null
}

export function AdminPage() {
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading } = useAuthSession()
  const { data: siteSettings } = useSiteSettings()
  const labels = parseAdminLabels(siteSettings?.admin_labels)
  const locale =
    typeof siteSettings?.locale === 'string' ? siteSettings.locale : ''
  const [activeTab, setActiveTab] = useState<AdminTab>('products')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [productForm, setProductForm] = useState<ProductFormState>(
    createEmptyProductForm,
  )
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(() =>
    createEmptyCategoryForm(),
  )
  const [settingsForm, setSettingsForm] = useState<SiteSettingsFormState>(() =>
    createSettingsForm(siteSettings),
  )

  const categoriesQuery = useQuery({
    queryKey: adminQueryKeys.categories(),
    queryFn: getAdminCategories,
    enabled: isAuthenticated,
  })
  const productsQuery = useQuery({
    queryKey: adminQueryKeys.products(),
    queryFn: getAdminProducts,
    enabled: isAuthenticated,
  })
  const ordersQuery = useQuery({
    queryKey: adminQueryKeys.orders(),
    queryFn: getAdminOrders,
    enabled: isAuthenticated,
  })
  const callbacksQuery = useQuery({
    queryKey: adminQueryKeys.callbacks(),
    queryFn: getAdminCallbackRequests,
    enabled: isAuthenticated,
  })

  const signInMutation = useMutation({
    mutationFn: () => signInWithEmail(email, password),
  })
  const signOutMutation = useMutation({
    mutationFn: signOut,
  })
  const saveProductMutation = useMutation({
    mutationFn: async (form: ProductFormState) => {
      const input = {
        category_id: form.categoryId,
        is_active: form.isActive,
        is_featured: form.isFeatured,
        name: form.name,
        price: Number(form.price),
        sku: form.sku,
        slug: form.slug,
        stock_quantity: Number(form.stockQuantity),
      }

      const productId = form.id

      if (productId) {
        await updateAdminProduct(productId, input)
      } else {
        const createdProductId = await createAdminProduct(input)
        if (form.imageFile) {
          await uploadAdminProductImage({
            alt: form.imageAlt || form.name,
            file: form.imageFile,
            productId: createdProductId,
          })
        }
        return
      }

      if (form.imageFile) {
        await uploadAdminProductImage({
          alt: form.imageAlt || form.name,
          file: form.imageFile,
          productId,
        })
      }
    },
    onSuccess: () => {
      setProductForm(createEmptyProductForm())
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products(),
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })
  const deleteProductMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products(),
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })
  const saveCategoryMutation = useMutation({
    mutationFn: async (form: CategoryFormState) => {
      const input = {
        is_active: form.isActive,
        name: form.name,
        slug: form.slug,
      }

      if (form.id) {
        await updateAdminCategory(form.id, input)
      } else {
        await createAdminCategory(input)
      }
    },
    onSuccess: () => {
      setCategoryForm(createEmptyCategoryForm())
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.categories(),
      })
      void queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.categories(),
      })
      void queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAdminOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() })
    },
  })
  const updateCallbackMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAdminCallbackRequestStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.callbacks(),
      })
    },
  })
  const saveSettingsMutation = useMutation({
    mutationFn: async (form: SiteSettingsFormState) => {
      await Promise.all([
        upsertAdminSiteSetting('site_profile', {
          address: form.address,
          email: form.email,
          logoAlt: form.logoAlt,
          logoUrl: form.logoUrl,
          phone: form.phone,
          storeName: form.storeName,
        }),
        upsertAdminSiteSetting('social_links', {
          max: form.max,
          telegram: form.telegram,
          vk: form.vk,
          whatsapp: form.whatsapp,
        }),
        upsertAdminSiteSetting('seo_settings', {
          description: form.seoDescription,
          keywords: form.seoKeywords,
          title: form.seoTitle,
        }),
      ])

      if (!form.logoFile) {
        return
      }

      const logoUrl = await uploadAdminSiteLogo({
        alt: form.logoAlt || form.storeName,
        file: form.logoFile,
      })

      await upsertAdminSiteSetting('site_profile', {
        address: form.address,
        email: form.email,
        logoAlt: form.logoAlt,
        logoUrl,
        phone: form.phone,
        storeName: form.storeName,
      })
    },
    onSuccess: () => {
      setSettingsForm((current) => ({
        ...current,
        logoFile: null,
      }))
      void queryClient.invalidateQueries()
      void queryClient.invalidateQueries({
        queryKey: contentQueryKeys.all,
      })
    },
  })

  if (isLoading || !labels || !locale) {
    return <AdminSkeleton />
  }

  if (!isAuthenticated) {
    return (
      <main className="py-10">
        <Container size="sm">
          <Card>
            <CardContent>
              <Typography as="h1" variant="h1" weight="bold">
                {labels.login}
              </Typography>
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  signInMutation.mutate()
                }}
              >
                <Input
                  placeholder={labels.email}
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                />
                <Input
                  placeholder={labels.password}
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                />
                <Button isLoading={signInMutation.isPending} type="submit">
                  {labels.login}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </main>
    )
  }

  const categories = categoriesQuery.data ?? []
  const products = productsQuery.data ?? []
  const orders = ordersQuery.data ?? []
  const callbacks = callbacksQuery.data ?? []

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Typography as="h1" variant="h1" weight="bold">
              {labels.adminTitle}
            </Typography>
            <Button
              variant="outline"
              onClick={() => {
                signOutMutation.mutate()
              }}
            >
              {labels.logout}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                'products',
                'categories',
                'orders',
                'callbacks',
                'settings',
              ] as const
            ).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'primary' : 'outline'}
                  onClick={() => {
                    if (tab === 'settings') {
                      setSettingsForm(createSettingsForm(siteSettings))
                    }
                    setActiveTab(tab)
                  }}
                >
                  {labels[tab]}
                </Button>
              ),
            )}
          </div>
          {activeTab === 'products' ? (
            <ProductsAdmin
              categories={categories}
              errorMessage={getMutationErrorMessage(saveProductMutation.error)}
              form={productForm}
              labels={labels}
              products={products}
              setForm={setProductForm}
              onDelete={(id) => {
                deleteProductMutation.mutate(id)
              }}
              onSubmit={(event) => {
                event.preventDefault()
                saveProductMutation.mutate(productForm)
              }}
            />
          ) : null}
          {activeTab === 'categories' ? (
            <CategoriesAdmin
              categories={categories}
              errorMessage={getMutationErrorMessage(saveCategoryMutation.error)}
              form={categoryForm}
              labels={labels}
              setForm={setCategoryForm}
              onDelete={(id) => {
                deleteCategoryMutation.mutate(id)
              }}
              onSubmit={(event) => {
                event.preventDefault()
                saveCategoryMutation.mutate(categoryForm)
              }}
            />
          ) : null}
          {activeTab === 'orders' ? (
            <OrdersAdmin
              labels={labels}
              locale={locale}
              orders={orders}
              onStatusChange={(id, status) => {
                updateOrderMutation.mutate({ id, status })
              }}
            />
          ) : null}
          {activeTab === 'callbacks' ? (
            <CallbacksAdmin
              callbacks={callbacks}
              labels={labels}
              locale={locale}
              onStatusChange={(id, status) => {
                updateCallbackMutation.mutate({ id, status })
              }}
            />
          ) : null}
          {activeTab === 'settings' ? (
            <SettingsAdmin
              errorMessage={getMutationErrorMessage(saveSettingsMutation.error)}
              form={settingsForm}
              labels={labels}
              setForm={setSettingsForm}
              onSubmit={(event) => {
                event.preventDefault()
                saveSettingsMutation.mutate(settingsForm)
              }}
            />
          ) : null}
        </div>
      </Container>
    </main>
  )
}

interface ProductsAdminProps {
  categories: TableRow<'categories'>[]
  errorMessage: string | null
  form: ProductFormState
  labels: AdminLabels
  products: TableRow<'products'>[]
  setForm: (form: ProductFormState) => void
  onDelete: (id: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}

function ProductsAdmin({
  categories,
  errorMessage,
  form,
  labels,
  products,
  setForm,
  onDelete,
  onSubmit,
}: ProductsAdminProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <Card>
        <CardContent>
          <Typography as="h2" variant="h3" weight="semibold">
            {labels.addProduct}
          </Typography>
          <form className="grid gap-3" onSubmit={onSubmit}>
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
              placeholder={labels.imageAlt}
              value={form.imageAlt}
              onChange={(event) => {
                setForm({ ...form, imageAlt: event.target.value })
              }}
            />
            <label className="grid gap-2">
              <span className="text-sm font-medium">{labels.image}</span>
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
            </label>
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
      <div className="grid gap-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <Typography as="h3" variant="h3" weight="semibold">
                  {product.name}
                </Typography>
                <Typography className="text-slate-500" variant="body-sm">
                  {product.sku} · {product.slug}
                </Typography>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm({
                      categoryId: product.category_id,
                      id: product.id,
                      imageAlt: product.name,
                      imageFile: null,
                      isActive: product.is_active,
                      isFeatured: product.is_featured,
                      name: product.name,
                      price: String(product.price),
                      sku: product.sku,
                      slug: product.slug,
                      stockQuantity: String(product.stock_quantity),
                    })
                  }}
                >
                  {labels.save}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(product.id)
                  }}
                >
                  {labels.delete}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface CategoriesAdminProps {
  categories: TableRow<'categories'>[]
  errorMessage: string | null
  form: CategoryFormState
  labels: AdminLabels
  setForm: (form: CategoryFormState) => void
  onDelete: (id: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}

function CategoriesAdmin({
  categories,
  errorMessage,
  form,
  labels,
  setForm,
  onDelete,
  onSubmit,
}: CategoriesAdminProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <Card>
        <CardContent>
          <Typography as="h2" variant="h3" weight="semibold">
            {labels.addCategory}
          </Typography>
          <form className="grid gap-3" onSubmit={onSubmit}>
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
      <div className="grid gap-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <Typography as="h3" variant="h3" weight="semibold">
                  {category.name}
                </Typography>
                <Typography className="text-slate-500" variant="body-sm">
                  {category.slug}
                </Typography>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm({
                      id: category.id,
                      isActive: category.is_active,
                      name: category.name,
                      slug: category.slug,
                    })
                  }}
                >
                  {labels.save}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(category.id)
                  }}
                >
                  {labels.delete}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface SettingsAdminProps {
  errorMessage: string | null
  form: SiteSettingsFormState
  labels: AdminLabels
  setForm: (form: SiteSettingsFormState) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}

function SettingsAdmin({
  errorMessage,
  form,
  labels,
  setForm,
  onSubmit,
}: SettingsAdminProps) {
  return (
    <Card>
      <CardContent>
        <form className="grid gap-6" onSubmit={onSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder={labels.storeName}
              value={form.storeName}
              onChange={(event) => {
                setForm({ ...form, storeName: event.target.value })
              }}
            />
            <Input
              placeholder={labels.storePhone}
              value={form.phone}
              onChange={(event) => {
                setForm({ ...form, phone: event.target.value })
              }}
            />
            <Input
              placeholder={labels.email}
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value })
              }}
            />
            <Input
              placeholder={labels.storeAddress}
              value={form.address}
              onChange={(event) => {
                setForm({ ...form, address: event.target.value })
              }}
            />
          </div>
          <div className="grid gap-3">
            <Typography as="h2" variant="h3" weight="semibold">
              {labels.logo}
            </Typography>
            {form.logoUrl ? (
              <img
                className="h-20 w-20 rounded-lg object-contain"
                src={form.logoUrl}
                alt={form.logoAlt}
              />
            ) : null}
            <Input
              placeholder={labels.logoAlt}
              value={form.logoAlt}
              onChange={(event) => {
                setForm({ ...form, logoAlt: event.target.value })
              }}
            />
            <Input
              accept="image/*"
              type="file"
              onChange={(event) => {
                setForm({
                  ...form,
                  logoFile: event.target.files?.[0] ?? null,
                })
              }}
            />
          </div>
          <div className="grid gap-3">
            <Typography as="h2" variant="h3" weight="semibold">
              {labels.socialLinks}
            </Typography>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder={labels.telegram}
                value={form.telegram}
                onChange={(event) => {
                  setForm({ ...form, telegram: event.target.value })
                }}
              />
              <Input
                placeholder={labels.whatsapp}
                value={form.whatsapp}
                onChange={(event) => {
                  setForm({ ...form, whatsapp: event.target.value })
                }}
              />
              <Input
                placeholder={labels.max}
                value={form.max}
                onChange={(event) => {
                  setForm({ ...form, max: event.target.value })
                }}
              />
              <Input
                placeholder={labels.vk}
                value={form.vk}
                onChange={(event) => {
                  setForm({ ...form, vk: event.target.value })
                }}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Typography as="h2" variant="h3" weight="semibold">
              {labels.seoTitle}
            </Typography>
            <Input
              placeholder={labels.seoTitle}
              value={form.seoTitle}
              onChange={(event) => {
                setForm({ ...form, seoTitle: event.target.value })
              }}
            />
            <Input
              placeholder={labels.seoDescription}
              value={form.seoDescription}
              onChange={(event) => {
                setForm({ ...form, seoDescription: event.target.value })
              }}
            />
            <Input
              placeholder={labels.seoKeywords}
              value={form.seoKeywords}
              onChange={(event) => {
                setForm({ ...form, seoKeywords: event.target.value })
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
      </CardContent>
    </Card>
  )
}

interface OrdersAdminProps {
  labels: AdminLabels
  locale: string
  orders: TableRow<'orders'>[]
  onStatusChange: (id: string, status: string) => void
}

function OrdersAdmin({
  labels,
  locale,
  orders,
  onStatusChange,
}: OrdersAdminProps) {
  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
            <div>
              <Typography as="h3" variant="h3" weight="semibold">
                {order.id}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {order.customer_name} · {order.customer_phone}
              </Typography>
              <Typography variant="body-sm">
                {formatCurrency(order.total_amount, locale)}
              </Typography>
            </div>
            <Select
              value={order.status}
              options={[
                { value: 'new', label: 'new' },
                { value: 'processing', label: 'processing' },
                { value: 'completed', label: 'completed' },
                { value: 'cancelled', label: 'cancelled' },
              ]}
              onChange={(event) => {
                onStatusChange(order.id, event.target.value)
              }}
            />
            <Typography className="sr-only" variant="caption">
              {labels.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface CallbacksAdminProps {
  callbacks: TableRow<'callback_requests'>[]
  labels: AdminLabels
  locale: string
  onStatusChange: (id: string, status: string) => void
}

function CallbacksAdmin({
  callbacks,
  labels,
  locale,
  onStatusChange,
}: CallbacksAdminProps) {
  return (
    <div className="grid gap-3">
      {callbacks.map((callback) => (
        <Card key={callback.id}>
          <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
            <div>
              <Typography as="h3" variant="h3" weight="semibold">
                {callback.customer_name}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {callback.customer_phone}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {new Date(callback.created_at).toLocaleString(locale)}
              </Typography>
            </div>
            <Select
              value={callback.status}
              options={[
                { value: 'new', label: 'new' },
                { value: 'processing', label: 'processing' },
                { value: 'completed', label: 'completed' },
                { value: 'cancelled', label: 'cancelled' },
              ]}
              onChange={(event) => {
                onStatusChange(callback.id, event.target.value)
              }}
            />
            <Typography className="sr-only" variant="caption">
              {labels.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
