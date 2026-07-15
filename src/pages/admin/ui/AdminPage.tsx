import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react'

import {
  adminQueryKeys,
  createAdminCategory,
  deleteAdminCategory,
  deleteAdminProduct,
  deleteAdminProductImage,
  getAdminCallbackRequests,
  getAdminCategories,
  getAdminInfoPages,
  getAdminOrdersWithDetails,
  getAdminProductsWithDetails,
  getMediaAssetPublicUrl,
  saveAdminInfoPage,
  saveAdminProductWithDetails,
  updateAdminCallbackRequestStatus,
  updateAdminCategory,
  updateAdminOrderStatus,
  uploadAdminFooterBackground,
  uploadAdminFooterCertificate,
  uploadAdminSiteLogo,
  upsertAdminSiteSetting,
} from '@entities/admin'
import type {
  AdminInfoPageRecord,
  AdminProductRecord,
  SaveAdminInfoPageInput,
} from '@entities/admin/api/adminRepository'
import { signInWithEmail, signOut, useAuthSession } from '@entities/auth'
import { categoryQueryKeys } from '@entities/category'
import { useSiteSettings } from '@entities/content'
import { contentQueryKeys } from '@entities/content'
import { productQueryKeys } from '@entities/product'
import {
  defaultMediaImageFieldLabels,
  MediaImageField,
} from '@features/media-library'
import type { Json, TableRow } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  Button,
  Card,
  CardContent,
  Container,
  Input,
  Select,
  showToast,
  Skeleton,
  Typography,
} from '@shared/ui'

import {
  joinMultilineValues,
  splitMultilineValues,
} from '@widgets/app-footer'
import { PagesAdmin } from './PagesAdmin'
import { RequestsAdmin } from './RequestPanels'
import { countNewRequests } from '../lib/requestStatus'
import {
  createEmptyProductForm,
  createProductFormFromRecord,
  mapProductFormToSaveInput,
  ProductAdminForm,
  ProductAdminList,
  type ProductFormState,
} from './ProductAdminForm'

type AdminTab = 'requests' | 'system'

type RequestsSection = 'orders' | 'callbacks'

type SystemSection = 'site' | 'products' | 'categories' | 'pages'

interface AdminLabels {
  aboutPage: string
  active: string
  addCategory: string
  addProduct: string
  addRow: string
  adminTitle: string
  applicationArea: string
  callbacks: string
  category: string
  categories: string
  catalogAction: string
  contactsPage: string
  delete: string
  deliveryPage: string
  description: string
  descriptionLeft: string
  descriptionRight: string
  edit: string
  email: string
  footer: string
  footerAddress: string
  footerBackground: string
  footerCertificate: string
  footerCompanyName: string
  footerCopyright: string
  footerEmails: string
  footerPhones: string
  featuredDetailsLabel: string
  featuredProducts: string
  featuredTitle: string
  image: string
  homePage: string
  imageAlt: string
  inactive: string
  login: string
  logo: string
  logoAlt: string
  logout: string
  mapLatitude: string
  mapLongitude: string
  mapTitle: string
  mapZoom: string
  max: string
  modificationApplicability: string
  modificationDesignation: string
  modificationFeatures: string
  modifications: string
  name: string
  orders: string
  packingNorm: string
  pageImage: string
  pageImageAlt: string
  pageMetaDescription: string
  pageMetaTitle: string
  pages: string
  pageTitle: string
  password: string
  price: string
  products: string
  productType: string
  removeRow: string
  requests: string
  save: string
  sectionText: string
  seoDescription: string
  seoKeywords: string
  seoTitle: string
  settings: string
  sketch: string
  sketchAlt: string
  sku: string
  slug: string
  socialLinks: string
  specificationName: string
  specifications: string
  specificationValue: string
  status: string
  stock: string
  storeAddress: string
  storeName: string
  storePhone: string
  systemSettings: string
  telegram: string
  vk: string
  warrantyPage: string
  whatsapp: string
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
  footerAddress: string
  footerBackgroundAlt: string
  footerBackgroundAssetId: string | null
  footerBackgroundFile: File | null
  footerBackgroundImageTouched: boolean
  footerBackgroundUrl: string
  footerCertificateAlt: string
  footerCertificateAssetId: string | null
  footerCertificateFile: File | null
  footerCertificateImageTouched: boolean
  footerCertificateUrl: string
  footerCompanyName: string
  footerCopyright: string
  footerEmails: string
  footerPhones: string
  logoAlt: string
  logoAssetId: string | null
  logoFile: File | null
  logoImageTouched: boolean
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

interface ResolvedSiteImageField {
  assetId: string | null
  url: string
}

async function resolveSiteImageField({
  assetId,
  existingAssetId,
  existingUrl,
  file,
  touched,
  upload,
}: {
  assetId: string | null
  existingAssetId: string | null
  existingUrl: string
  file: File | null
  touched: boolean
  upload: (file: File) => Promise<{ assetId: string; publicUrl: string }>
}): Promise<ResolvedSiteImageField> {
  if (file) {
    const uploaded = await upload(file)

    return {
      assetId: uploaded.assetId,
      url: uploaded.publicUrl,
    }
  }

  if (!touched) {
    return {
      assetId: existingAssetId,
      url: existingUrl,
    }
  }

  if (!assetId) {
    return {
      assetId: null,
      url: '',
    }
  }

  const resolvedUrl = (await getMediaAssetPublicUrl(assetId)) ?? ''

  return {
    assetId,
    url: resolvedUrl,
  }
}

function parseAdminLabels(value: Json | undefined): AdminLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const labels: Partial<AdminLabels> = {}
  const keys: (keyof AdminLabels)[] = [
    'aboutPage',
    'active',
    'addCategory',
    'addProduct',
    'addRow',
    'adminTitle',
    'applicationArea',
    'callbacks',
    'category',
    'categories',
    'catalogAction',
    'contactsPage',
    'delete',
    'deliveryPage',
    'description',
    'descriptionLeft',
    'descriptionRight',
    'edit',
    'email',
    'footer',
    'footerAddress',
    'footerBackground',
    'footerCertificate',
    'footerCompanyName',
    'footerCopyright',
    'footerEmails',
    'footerPhones',
    'featuredDetailsLabel',
    'featuredProducts',
    'featuredTitle',
    'homePage',
    'image',
    'imageAlt',
    'inactive',
    'login',
    'logo',
    'logoAlt',
    'logout',
    'mapLatitude',
    'mapLongitude',
    'mapTitle',
    'mapZoom',
    'max',
    'modificationApplicability',
    'modificationDesignation',
    'modificationFeatures',
    'modifications',
    'name',
    'orders',
    'packingNorm',
    'pageImage',
    'pageImageAlt',
    'pageMetaDescription',
    'pageMetaTitle',
    'pages',
    'pageTitle',
    'password',
    'price',
    'products',
    'productType',
    'removeRow',
    'requests',
    'save',
    'sectionText',
    'seoDescription',
    'seoKeywords',
    'seoTitle',
    'settings',
    'sketch',
    'sketchAlt',
    'sku',
    'slug',
    'socialLinks',
    'specificationName',
    'specifications',
    'specificationValue',
    'status',
    'stock',
    'storeAddress',
    'storeName',
    'storePhone',
    'systemSettings',
    'telegram',
    'vk',
    'warrantyPage',
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

interface CategoryFormState {
  id: string | null
  isActive: boolean
  name: string
  slug: string
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
  const footerSettings = isJsonRecord(siteSettings?.footer_settings)
    ? siteSettings.footer_settings
    : undefined
  const footerEmails = Array.isArray(footerSettings?.emails)
    ? footerSettings.emails.flatMap((item) =>
        typeof item === 'string' && item.trim().length > 0 ? [item.trim()] : [],
      )
    : []
  const footerPhones = Array.isArray(footerSettings?.phones)
    ? footerSettings.phones.flatMap((item) =>
        typeof item === 'string' && item.trim().length > 0 ? [item.trim()] : [],
      )
    : []

  return {
    address: siteProfile ? (getJsonString(siteProfile, 'address') ?? '') : '',
    email: siteProfile ? (getJsonString(siteProfile, 'email') ?? '') : '',
    footerAddress: footerSettings
      ? (getJsonString(footerSettings, 'address') ?? '')
      : '',
    footerBackgroundAlt: footerSettings
      ? (getJsonString(footerSettings, 'backgroundAlt') ?? 'Фон футера')
      : 'Фон футера',
    footerBackgroundAssetId: footerSettings
      ? (getJsonString(footerSettings, 'backgroundAssetId') ?? null)
      : null,
    footerBackgroundFile: null,
    footerBackgroundImageTouched: false,
    footerBackgroundUrl: footerSettings
      ? (getJsonString(footerSettings, 'backgroundUrl') ?? '')
      : '',
    footerCertificateAlt: footerSettings
      ? (getJsonString(footerSettings, 'certificateAlt') ?? 'Сертификат')
      : 'Сертификат',
    footerCertificateAssetId: footerSettings
      ? (getJsonString(footerSettings, 'certificateAssetId') ?? null)
      : null,
    footerCertificateFile: null,
    footerCertificateImageTouched: false,
    footerCertificateUrl: footerSettings
      ? (getJsonString(footerSettings, 'certificateUrl') ?? '')
      : '',
    footerCompanyName: footerSettings
      ? (getJsonString(footerSettings, 'companyName') ?? '')
      : '',
    footerCopyright: footerSettings
      ? (getJsonString(footerSettings, 'copyright') ?? '')
      : '',
    footerEmails: joinMultilineValues(footerEmails),
    footerPhones: joinMultilineValues(footerPhones),
    logoAlt: siteProfile ? (getJsonString(siteProfile, 'logoAlt') ?? '') : '',
    logoAssetId: siteProfile
      ? (getJsonString(siteProfile, 'logoAssetId') ?? null)
      : null,
    logoFile: null,
    logoImageTouched: false,
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

function getMutationErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null
}

function showAdminSaveSuccessToast(title: string) {
  showToast({
    message: 'Изменения сохранены',
    title,
    type: 'success',
  })
}

function showAdminSaveErrorToast(error: unknown) {
  showToast({
    message:
      error instanceof Error ? error.message : 'Не удалось сохранить изменения',
    title: 'Ошибка',
    type: 'error',
  })
}

export function AdminPage() {
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading } = useAuthSession()
  const { data: siteSettings } = useSiteSettings()
  const labels = parseAdminLabels(siteSettings?.admin_labels)
  const locale =
    typeof siteSettings?.locale === 'string' ? siteSettings.locale : ''
  const [activeTab, setActiveTab] = useState<AdminTab>('requests')
  const [activeRequestsSection, setActiveRequestsSection] =
    useState<RequestsSection>('orders')
  const [activeSystemSection, setActiveSystemSection] =
    useState<SystemSection>('site')
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

  useEffect(() => {
    if (!siteSettings) {
      return
    }

    setSettingsForm((current) => {
      if (
        current.storeName.trim().length > 0 ||
        current.logoUrl.trim().length > 0 ||
        current.logoAssetId
      ) {
        return current
      }

      return createSettingsForm(siteSettings)
    })
  }, [siteSettings])

  const categoriesQuery = useQuery({
    queryKey: adminQueryKeys.categories(),
    queryFn: getAdminCategories,
    enabled: isAuthenticated,
  })
  const productsQuery = useQuery({
    queryKey: adminQueryKeys.products(),
    queryFn: getAdminProductsWithDetails,
    enabled: isAuthenticated,
  })
  const ordersQuery = useQuery({
    queryKey: adminQueryKeys.orders(),
    queryFn: getAdminOrdersWithDetails,
    enabled: isAuthenticated,
  })
  const callbacksQuery = useQuery({
    queryKey: adminQueryKeys.callbacks(),
    queryFn: getAdminCallbackRequests,
    enabled: isAuthenticated,
  })
  const infoPagesQuery = useQuery({
    queryKey: adminQueryKeys.infoPages(),
    queryFn: getAdminInfoPages,
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
      await saveAdminProductWithDetails(mapProductFormToSaveInput(form))
      return form.name
    },
    onSuccess: (productName) => {
      showAdminSaveSuccessToast(productName || 'Товар')
      setProductForm(createEmptyProductForm())
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.products(),
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
    onError: showAdminSaveErrorToast,
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
  const deleteProductImageMutation = useMutation({
    mutationFn: deleteAdminProductImage,
    onSuccess: (_data, imageId) => {
      setProductForm((current) => ({
        ...current,
        existingImages: current.existingImages.filter(
          (image) => image.id !== imageId,
        ),
      }))
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

      return form.name
    },
    onSuccess: (categoryName) => {
      showAdminSaveSuccessToast(categoryName || 'Категория')
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
    onError: showAdminSaveErrorToast,
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
      const siteProfile = isJsonRecord(siteSettings?.site_profile)
        ? siteSettings.site_profile
        : undefined
      const footerSettings = isJsonRecord(siteSettings?.footer_settings)
        ? siteSettings.footer_settings
        : undefined

      const logo = await resolveSiteImageField({
        assetId: form.logoAssetId,
        existingAssetId: siteProfile
          ? (getJsonString(siteProfile, 'logoAssetId') ?? null)
          : null,
        existingUrl: siteProfile
          ? (getJsonString(siteProfile, 'logoUrl') ?? '')
          : '',
        file: form.logoFile,
        touched: form.logoImageTouched,
        upload: (file) =>
          uploadAdminSiteLogo({
            alt: form.logoAlt || form.storeName || 'Logo',
            file,
          }),
      })
      const footerBackground = await resolveSiteImageField({
        assetId: form.footerBackgroundAssetId,
        existingAssetId: footerSettings
          ? (getJsonString(footerSettings, 'backgroundAssetId') ?? null)
          : null,
        existingUrl: footerSettings
          ? (getJsonString(footerSettings, 'backgroundUrl') ?? '')
          : '',
        file: form.footerBackgroundFile,
        touched: form.footerBackgroundImageTouched,
        upload: (file) =>
          uploadAdminFooterBackground({
            alt: form.footerBackgroundAlt || 'Footer background',
            file,
          }),
      })
      const footerCertificate = await resolveSiteImageField({
        assetId: form.footerCertificateAssetId,
        existingAssetId: footerSettings
          ? (getJsonString(footerSettings, 'certificateAssetId') ?? null)
          : null,
        existingUrl: footerSettings
          ? (getJsonString(footerSettings, 'certificateUrl') ?? '')
          : '',
        file: form.footerCertificateFile,
        touched: form.footerCertificateImageTouched,
        upload: (file) =>
          uploadAdminFooterCertificate({
            alt: form.footerCertificateAlt || 'Certificate',
            file,
          }),
      })

      await Promise.all([
        upsertAdminSiteSetting('site_profile', {
          address: form.address,
          email: form.email,
          logoAlt: form.logoAlt,
          logoAssetId: logo.assetId,
          logoUrl: logo.url,
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
        upsertAdminSiteSetting('footer_settings', {
          address: form.footerAddress,
          backgroundAlt: form.footerBackgroundAlt,
          backgroundAssetId: footerBackground.assetId,
          backgroundUrl: footerBackground.url,
          certificateAlt: form.footerCertificateAlt,
          certificateAssetId: footerCertificate.assetId,
          certificateUrl: footerCertificate.url,
          companyName: form.footerCompanyName,
          copyright: form.footerCopyright,
          emails: splitMultilineValues(form.footerEmails),
          phones: splitMultilineValues(form.footerPhones),
        }),
      ])

      return {
        footerBackgroundAssetId: footerBackground.assetId,
        footerBackgroundUrl: footerBackground.url,
        footerCertificateAssetId: footerCertificate.assetId,
        footerCertificateUrl: footerCertificate.url,
        logoAssetId: logo.assetId,
        logoUrl: logo.url,
      }
    },
    onSuccess: (result) => {
      showAdminSaveSuccessToast('Настройки')
      setSettingsForm((current) => ({
        ...current,
        footerBackgroundAssetId: result.footerBackgroundAssetId,
        footerBackgroundFile: null,
        footerBackgroundImageTouched: false,
        footerBackgroundUrl: result.footerBackgroundUrl,
        footerCertificateAssetId: result.footerCertificateAssetId,
        footerCertificateFile: null,
        footerCertificateImageTouched: false,
        footerCertificateUrl: result.footerCertificateUrl,
        logoAssetId: result.logoAssetId,
        logoFile: null,
        logoImageTouched: false,
        logoUrl: result.logoUrl,
      }))
      void queryClient.invalidateQueries()
      void queryClient.invalidateQueries({
        queryKey: contentQueryKeys.all,
      })
    },
    onError: showAdminSaveErrorToast,
  })
  const saveInfoPageMutation = useMutation({
    mutationFn: saveAdminInfoPage,
    onSuccess: (_data, input) => {
      showAdminSaveSuccessToast(input.title || 'Страница')
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.infoPages(),
      })
      void queryClient.invalidateQueries({
        queryKey: contentQueryKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
    onError: showAdminSaveErrorToast,
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
  const infoPages = infoPagesQuery.data ?? []
  const newRequestsCount =
    countNewRequests(orders.map((record) => record.order)) +
    countNewRequests(callbacks)

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
            {(['requests', 'system'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'primary' : 'outline'}
                onClick={() => {
                  if (tab === 'system') {
                    setSettingsForm(createSettingsForm(siteSettings))
                  }
                  setActiveTab(tab)
                }}
              >
                <span className="inline-flex items-center">
                  {tab === 'requests' ? labels.requests : labels.systemSettings}
                  {tab === 'requests' && newRequestsCount > 0 ? (
                    <span className="ml-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
                      {newRequestsCount > 99 ? '99+' : newRequestsCount}
                    </span>
                  ) : null}
                </span>
              </Button>
            ))}
          </div>
          {activeTab === 'requests' ? (
            <RequestsAdmin
              activeSection={activeRequestsSection}
              callbacks={callbacks}
              labels={labels}
              locale={locale}
              orders={orders}
              onCallbackStatusChange={(id, status) => {
                updateCallbackMutation.mutate({ id, status })
              }}
              onOrderStatusChange={(id, status) => {
                updateOrderMutation.mutate({ id, status })
              }}
              onSectionChange={setActiveRequestsSection}
            />
          ) : null}
          {activeTab === 'system' ? (
            <SystemAdmin
              activeSection={activeSystemSection}
              categories={categories}
              categoryForm={categoryForm}
              deleteCategoryError={getMutationErrorMessage(
                deleteCategoryMutation.error,
              )}
              deleteProductError={getMutationErrorMessage(
                deleteProductMutation.error,
              )}
              deleteProductImageError={getMutationErrorMessage(
                deleteProductImageMutation.error,
              )}
              infoPages={infoPages}
              labels={labels}
              productForm={productForm}
              products={products}
              saveCategoryError={getMutationErrorMessage(
                saveCategoryMutation.error,
              )}
              saveInfoPageError={getMutationErrorMessage(
                saveInfoPageMutation.error,
              )}
              saveProductError={getMutationErrorMessage(
                saveProductMutation.error,
              )}
              saveSettingsError={getMutationErrorMessage(
                saveSettingsMutation.error,
              )}
              settingsForm={settingsForm}
              setCategoryForm={setCategoryForm}
              setProductForm={setProductForm}
              setSettingsForm={setSettingsForm}
              onDeleteCategory={(id) => {
                deleteCategoryMutation.mutate(id)
              }}
              onDeleteProduct={(id) => {
                deleteProductMutation.mutate(id)
              }}
              onDeleteProductImage={(imageId) => {
                deleteProductImageMutation.mutate(imageId)
              }}
              onEditProduct={(record) => {
                setProductForm(createProductFormFromRecord(record))
              }}
              onSaveCategory={(event) => {
                event.preventDefault()
                saveCategoryMutation.mutate(categoryForm)
              }}
              onSaveInfoPage={(input) => {
                saveInfoPageMutation.mutate(input)
              }}
              onSaveProduct={(event) => {
                event.preventDefault()
                saveProductMutation.mutate(productForm)
              }}
              onSaveSettings={(event) => {
                event.preventDefault()
                saveSettingsMutation.mutate(settingsForm)
              }}
              onSectionChange={setActiveSystemSection}
            />
          ) : null}
        </div>
      </Container>
    </main>
  )
}

const SYSTEM_SECTIONS: {
  id: SystemSection
  labelKey: keyof Pick<
    AdminLabels,
    'settings' | 'products' | 'categories' | 'pages'
  >
}[] = [
  { id: 'site', labelKey: 'settings' },
  { id: 'products', labelKey: 'products' },
  { id: 'categories', labelKey: 'categories' },
  { id: 'pages', labelKey: 'pages' },
]

interface SystemAdminProps {
  activeSection: SystemSection
  categories: TableRow<'categories'>[]
  categoryForm: CategoryFormState
  deleteCategoryError: string | null
  deleteProductError: string | null
  deleteProductImageError: string | null
  infoPages: AdminInfoPageRecord[]
  labels: AdminLabels
  productForm: ProductFormState
  products: AdminProductRecord[]
  saveCategoryError: string | null
  saveInfoPageError: string | null
  saveProductError: string | null
  saveSettingsError: string | null
  settingsForm: SiteSettingsFormState
  setCategoryForm: (form: CategoryFormState) => void
  setProductForm: Dispatch<SetStateAction<ProductFormState>>
  setSettingsForm: Dispatch<SetStateAction<SiteSettingsFormState>>
  onDeleteCategory: (id: string) => void
  onDeleteProduct: (id: string) => void
  onDeleteProductImage: (imageId: string) => void
  onEditProduct: (record: AdminProductRecord) => void
  onSaveCategory: (event: SyntheticEvent<HTMLFormElement>) => void
  onSaveInfoPage: (input: SaveAdminInfoPageInput) => void
  onSaveProduct: (event: SyntheticEvent<HTMLFormElement>) => void
  onSaveSettings: (event: SyntheticEvent<HTMLFormElement>) => void
  onSectionChange: (section: SystemSection) => void
}

function SystemAdmin({
  activeSection,
  categories,
  categoryForm,
  deleteCategoryError,
  deleteProductError,
  deleteProductImageError,
  infoPages,
  labels,
  productForm,
  products,
  saveCategoryError,
  saveInfoPageError,
  saveProductError,
  saveSettingsError,
  settingsForm,
  setCategoryForm,
  setProductForm,
  setSettingsForm,
  onDeleteCategory,
  onDeleteProduct,
  onDeleteProductImage,
  onEditProduct,
  onSaveCategory,
  onSaveInfoPage,
  onSaveProduct,
  onSaveSettings,
  onSectionChange,
}: SystemAdminProps) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {SYSTEM_SECTIONS.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'primary' : 'outline'}
            onClick={() => {
              onSectionChange(section.id)
            }}
          >
            {labels[section.labelKey]}
          </Button>
        ))}
      </div>
      {activeSection === 'site' ? (
        <SettingsAdmin
          errorMessage={saveSettingsError}
          form={settingsForm}
          labels={labels}
          setForm={setSettingsForm}
          onSubmit={onSaveSettings}
        />
      ) : null}
      {activeSection === 'products' ? (
        <div className="grid gap-6 lg:grid-cols-[28rem_minmax(0,1fr)]">
          <ProductAdminForm
            categories={categories}
            errorMessage={saveProductError ?? deleteProductImageError}
            form={productForm}
            labels={labels}
            setForm={setProductForm}
            onDeleteImage={onDeleteProductImage}
            onSubmit={onSaveProduct}
          />
          <ProductAdminList
            errorMessage={deleteProductError}
            labels={labels}
            products={products}
            onDelete={onDeleteProduct}
            onEdit={onEditProduct}
          />
        </div>
      ) : null}
      {activeSection === 'categories' ? (
        <CategoriesAdmin
          categories={categories}
          errorMessage={saveCategoryError ?? deleteCategoryError}
          form={categoryForm}
          labels={labels}
          setForm={setCategoryForm}
          onDelete={onDeleteCategory}
          onSubmit={onSaveCategory}
        />
      ) : null}
      {activeSection === 'pages' ? (
        <PagesAdmin
          errorMessage={saveInfoPageError}
          infoPages={infoPages}
          labels={labels}
          products={products.map((record) => record.product)}
          onSave={onSaveInfoPage}
        />
      ) : null}
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
                  {labels.edit}
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
        {errorMessage ? (
          <Typography className="text-red-600" variant="body-sm">
            {errorMessage}
          </Typography>
        ) : null}
      </div>
    </div>
  )
}

interface SettingsAdminProps {
  errorMessage: string | null
  form: SiteSettingsFormState
  labels: AdminLabels
  setForm: Dispatch<SetStateAction<SiteSettingsFormState>>
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
            <MediaImageField
              alt={form.logoAlt}
              altLabel={labels.logoAlt}
              file={form.logoFile}
              folderPrefix="settings/logo"
              imageClassName="h-16 w-full max-w-md object-contain object-left"
              labels={defaultMediaImageFieldLabels}
              url={form.logoUrl}
              onAltChange={(value) => {
                setForm((current) => ({ ...current, logoAlt: value }))
              }}
              onClear={() => {
                setForm((current) => ({
                  ...current,
                  logoAssetId: null,
                  logoFile: null,
                  logoImageTouched: true,
                  logoUrl: '',
                }))
              }}
              onFileChange={(file) => {
                setForm((current) => ({
                  ...current,
                  logoAssetId: null,
                  logoFile: file,
                  logoImageTouched: true,
                }))
              }}
              onLibrarySelect={(asset) => {
                setForm((current) => ({
                  ...current,
                  logoAlt: current.logoAlt || asset.alt,
                  logoAssetId: asset.id,
                  logoFile: null,
                  logoImageTouched: true,
                  logoUrl: asset.publicUrl,
                }))
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
              {labels.footer}
            </Typography>
            <Input
              placeholder={labels.footerCopyright}
              value={form.footerCopyright}
              onChange={(event) => {
                setForm({ ...form, footerCopyright: event.target.value })
              }}
            />
            <Input
              placeholder={labels.footerCompanyName}
              value={form.footerCompanyName}
              onChange={(event) => {
                setForm({ ...form, footerCompanyName: event.target.value })
              }}
            />
            <Input
              placeholder={labels.footerAddress}
              value={form.footerAddress}
              onChange={(event) => {
                setForm({ ...form, footerAddress: event.target.value })
              }}
            />
            <label className="grid gap-2">
              <span className="text-sm font-medium">{labels.footerEmails}</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder={labels.footerEmails}
                value={form.footerEmails}
                onChange={(event) => {
                  setForm({ ...form, footerEmails: event.target.value })
                }}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">{labels.footerPhones}</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder={labels.footerPhones}
                value={form.footerPhones}
                onChange={(event) => {
                  setForm({ ...form, footerPhones: event.target.value })
                }}
              />
            </label>
            <Typography as="h3" variant="body" weight="semibold">
              {labels.footerBackground}
            </Typography>
            <MediaImageField
              alt={form.footerBackgroundAlt}
              altLabel={labels.imageAlt}
              file={form.footerBackgroundFile}
              folderPrefix="settings/footer"
              imageClassName="h-32 w-full max-w-3xl rounded-lg object-cover object-center"
              labels={defaultMediaImageFieldLabels}
              url={form.footerBackgroundUrl}
              onAltChange={(value) => {
                setForm((current) => ({
                  ...current,
                  footerBackgroundAlt: value,
                }))
              }}
              onClear={() => {
                setForm((current) => ({
                  ...current,
                  footerBackgroundAssetId: null,
                  footerBackgroundFile: null,
                  footerBackgroundImageTouched: true,
                  footerBackgroundUrl: '',
                }))
              }}
              onFileChange={(file) => {
                setForm((current) => ({
                  ...current,
                  footerBackgroundAssetId: null,
                  footerBackgroundFile: file,
                  footerBackgroundImageTouched: true,
                }))
              }}
              onLibrarySelect={(asset) => {
                setForm((current) => ({
                  ...current,
                  footerBackgroundAlt: current.footerBackgroundAlt || asset.alt,
                  footerBackgroundAssetId: asset.id,
                  footerBackgroundFile: null,
                  footerBackgroundImageTouched: true,
                  footerBackgroundUrl: asset.publicUrl,
                }))
              }}
            />
            <Typography as="h3" variant="body" weight="semibold">
              {labels.footerCertificate}
            </Typography>
            <MediaImageField
              alt={form.footerCertificateAlt}
              altLabel={labels.imageAlt}
              file={form.footerCertificateFile}
              folderPrefix="settings/footer-certificate"
              imageClassName="h-auto w-[5.5rem] bg-white object-contain shadow-[0_0_0_1px_rgba(255,255,255,0.9)]"
              labels={defaultMediaImageFieldLabels}
              url={form.footerCertificateUrl}
              onAltChange={(value) => {
                setForm((current) => ({
                  ...current,
                  footerCertificateAlt: value,
                }))
              }}
              onClear={() => {
                setForm((current) => ({
                  ...current,
                  footerCertificateAssetId: null,
                  footerCertificateFile: null,
                  footerCertificateImageTouched: true,
                  footerCertificateUrl: '',
                }))
              }}
              onFileChange={(file) => {
                setForm((current) => ({
                  ...current,
                  footerCertificateAssetId: null,
                  footerCertificateFile: file,
                  footerCertificateImageTouched: true,
                }))
              }}
              onLibrarySelect={(asset) => {
                setForm((current) => ({
                  ...current,
                  footerCertificateAlt: current.footerCertificateAlt || asset.alt,
                  footerCertificateAssetId: asset.id,
                  footerCertificateFile: null,
                  footerCertificateImageTouched: true,
                  footerCertificateUrl: asset.publicUrl,
                }))
              }}
            />
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

