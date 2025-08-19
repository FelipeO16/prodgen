import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'

const useProductsStore = () => {
  const products = ref([])
  const currentProduct = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    category: 'all',
    minPrice: null,
    maxPrice: null,
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })

  const hasProducts = computed(() => products.value.length > 0)
  const hasNextPage = computed(() => pagination.value.currentPage < pagination.value.totalPages)
  const hasPreviousPage = computed(() => pagination.value.currentPage > 1)
  const featuredProducts = computed(() => products.value.filter(p => p.featured))
  const filteredProductsCount = computed(() => products.value.length)
  const isFirstPage = computed(() => pagination.value.currentPage === 1)
  const isLastPage = computed(() => pagination.value.currentPage === pagination.value.totalPages)

  const updateFilters = (newFilters: Record<string, unknown>) => {
    Object.assign(filters.value, newFilters)
  }

  const updatePagination = (newPagination: Record<string, unknown>) => {
    Object.assign(pagination.value, newPagination)
  }

  const goToPage = (page: number) => {
    pagination.value.currentPage = page
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const fetchProducts = vi.fn()

  return {
    products,
    currentProduct,
    categories,
    loading,
    error,
    filters,
    pagination,
    hasProducts,
    hasNextPage,
    hasPreviousPage,
    featuredProducts,
    filteredProductsCount,
    isFirstPage,
    isLastPage,
    updateFilters,
    updatePagination,
    goToPage,
    resetFilters,
    clearError,
    fetchProducts
  }
}

vi.mock('~/services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    getCategories: vi.fn()
  }
}))

describe('Products Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useProductsStore()
    
    expect(store.products.value).toEqual([])
    expect(store.currentProduct.value).toBeNull()
    expect(store.categories.value).toEqual([])
    expect(store.loading.value).toBe(false)
    expect(store.error.value).toBeNull()
    expect(store.filters.value).toEqual({
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name',
      sortOrder: 'asc'
    })
    expect(store.pagination.value).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12
    })
  })

  it('should have correct getters', () => {
    const store = useProductsStore()
    
    expect(store.hasProducts.value).toBe(false)
    expect(store.hasNextPage.value).toBe(false)
    expect(store.hasPreviousPage.value).toBe(false)
    expect(store.featuredProducts.value).toEqual([])
    expect(store.filteredProductsCount.value).toBe(0)
    expect(store.isFirstPage.value).toBe(true)
    expect(store.isLastPage.value).toBe(true)
  })

  it('should update filters correctly', () => {
    const store = useProductsStore()
    
    store.updateFilters({
      search: 'test',
      category: 'Eletrônicos',
      minPrice: 100,
      maxPrice: 1000
    })
    
    expect(store.filters.value.search).toBe('test')
    expect(store.filters.value.category).toBe('Eletrônicos')
    expect(store.filters.value.minPrice).toBe(100)
    expect(store.filters.value.maxPrice).toBe(1000)
  })

  it('should update pagination correctly', () => {
    const store = useProductsStore()
    
    store.updatePagination({
      currentPage: 2,
      totalPages: 5,
      totalItems: 50,
      itemsPerPage: 12
    })
    
    expect(store.pagination.value.currentPage).toBe(2)
    expect(store.pagination.value.totalPages).toBe(5)
    expect(store.pagination.value.totalItems).toBe(50)
    expect(store.pagination.value.itemsPerPage).toBe(12)
  })

  it('should go to page correctly', () => {
    const store = useProductsStore()
    
    store.goToPage(3)
    
    expect(store.pagination.value.currentPage).toBe(3)
  })

  it('should reset filters correctly', () => {
    const store = useProductsStore()
    
    store.filters.value.search = 'test'
    store.filters.value.category = 'Eletrônicos'
    store.filters.value.minPrice = 100
    store.filters.value.maxPrice = 1000
    
    store.resetFilters()
    
    expect(store.filters.value.search).toBe('')
    expect(store.filters.value.category).toBe('all')
    expect(store.filters.value.minPrice).toBeNull()
    expect(store.filters.value.maxPrice).toBeNull()
  })

  it('should clear error correctly', () => {
    const store = useProductsStore()
    
    store.error.value = 'Test error'
    store.clearError()
    
    expect(store.error.value).toBeNull()
  })
})
