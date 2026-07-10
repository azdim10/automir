export {
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProducts,
} from './api/productRepository'
export { productQueryKeys } from './model/product.queryKeys'
export { useFeaturedProducts } from './model/useFeaturedProducts'
export { useProduct } from './model/useProduct'
export { useProducts } from './model/useProducts'
export { ProductCard } from './ui/ProductCard'
export { ProductGallery } from './ui/ProductGallery'
export { ProductPrice } from './ui/ProductPrice'
export type {
  Product,
  ProductAttribute,
  ProductCategory,
  ProductImage,
  ProductListParams,
  ProductListResult,
  ProductSort,
} from './model/product.types'
