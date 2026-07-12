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
          element: <CategoriesPage />,
        },
        {
          path: 'catalog/:categorySlug',
          element: <CatalogPage />,
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
