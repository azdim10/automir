import { createBrowserRouter } from 'react-router'

import { ShopLayout } from '@app/layouts/ShopLayout'
import {
  AdminPage,
  CartPage,
  CatalogPage,
  CategoriesPage,
  CheckoutPage,
  ContactsPage,
  ContentPage,
  HomePage,
  NewsPage,
  ProductDetailsPage,
  StaticContentPage,
} from '@pages/index'

export const router = createBrowserRouter(
  [
    {
      element: <ShopLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'catalog',
          element: <CatalogPage />,
        },
        {
          path: 'catalog/categories',
          element: <CategoriesPage />,
        },
        {
          path: 'catalog/:categorySlug',
          element: <CatalogPage />,
        },
        {
          path: 'delivery',
          element: <StaticContentPage slug="delivery" />,
        },
        {
          path: 'warranty',
          element: <StaticContentPage slug="warranty" />,
        },
        {
          path: 'about',
          element: <StaticContentPage slug="about" />,
        },
        {
          path: 'contacts',
          element: <ContactsPage />,
        },
        {
          path: 'news',
          element: <NewsPage />,
        },
        {
          path: 'product/:productId',
          element: <ProductDetailsPage />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: 'checkout',
          element: <CheckoutPage />,
        },
        {
          path: 'page/:slug',
          element: <ContentPage />,
        },
      ],
    },
    {
      path: 'admin',
      element: <AdminPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
