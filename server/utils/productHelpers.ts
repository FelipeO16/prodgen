import type { Product, ProductFilters, PaginationMeta, ProductsResponse } from '~~/types/product'

export function simulateLatency(min = 300, max = 600): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise<void>((resolve) => setTimeout(resolve, delay))
}

export function filterProducts(products: Product[], filters: Partial<ProductFilters>): Product[] {
  let filtered = [...products]

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!)
  }

  return filtered
}

export function sortProducts(products: Product[], sortBy: string = 'name', sortOrder: string = 'asc'): Product[] {
  const sorted = [...products]

  sorted.sort((a, b) => {
    let valueA: number | string | Date
    let valueB: number | string | Date

    switch (sortBy) {
      case 'price':
        valueA = a.price
        valueB = b.price
        break
      case 'rating':
        valueA = a.rating
        valueB = b.rating
        break
      case 'createdAt':
        valueA = new Date(a.createdAt)
        valueB = new Date(b.createdAt)
        break
      default:
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

export function paginateProducts(
  products: Product[],
  page: number = 1,
  limit: number = 12
): ProductsResponse {
  const totalItems = products.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedProducts = products.slice(startIndex, endIndex)

  const meta: PaginationMeta = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit
  }

  return {
    products: paginatedProducts,
    meta
  }
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

