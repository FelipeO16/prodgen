export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  rating: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sortBy: 'name' | 'price' | 'rating' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface ProductsResponse {
  products: Product[]
  meta: PaginationMeta
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  featured?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export const PRODUCT_CATEGORIES = [
  'Eletrônicos',
  'Roupas',
  'Casa e Jardim',
  'Esportes',
  'Livros',
  'Saúde e Beleza',
  'Brinquedos',
  'Automóveis'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

