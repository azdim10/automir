import { createBrowserRouter } from 'react-router'

import { ShopLayout } from '@app/layouts/ShopLayout'
import {
  AdminPage,
  CartPage,
  CatalogPage,
  CheckoutPage,
  ContentPage,
  HomePage,
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
          element: <CatalogPage />,
        },
        {
          path: 'catalog/:categorySlug',
          element: <CatalogPage />,
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
