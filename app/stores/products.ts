import { defineStore } from 'pinia'
import type { 
  Product, 
  ProductFilters, 
  ProductsResponse, 
  PaginationMeta, 
  CreateProductData, 
  UpdateProductData,
  ProductCategory
} from '~~/types/product'
import { productService } from '~/services/productService'

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  categories: ProductCategory[]
  filters: ProductFilters
  pagination: PaginationMeta
  loading: boolean
  error: string | null
}

export const useProductsStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    currentProduct: null,
    categories: [],
    filters: {
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name',
      sortOrder: 'asc'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12
    },
    loading: false,
    error: null
  }),

  getters: {
    hasProducts: (state) => state.products.length > 0,
    hasNextPage: (state) => state.pagination.currentPage < state.pagination.totalPages,
    hasPreviousPage: (state) => state.pagination.currentPage > 1,
    featuredProducts: (state) => state.products.filter(product => product.featured),
    filteredProductsCount: (state) => state.pagination.totalItems,
    isFirstPage: (state) => state.pagination.currentPage === 1,
    isLastPage: (state) => state.pagination.currentPage === state.pagination.totalPages
  },

  actions: {
    async fetchProducts(page = 1) {
      this.loading = true
      this.error = null
      
      try {
        const response: ProductsResponse = await productService.getProducts(
          this.filters,
          page,
          this.pagination.itemsPerPage
        )
        
        this.products = response.products
        this.pagination = response.meta
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar produtos'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: string) {
      this.loading = true
      this.error = null
      
      try {
        this.currentProduct = await productService.getProduct(id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar produto'
        this.currentProduct = null
      } finally {
        this.loading = false
      }
    },

    async createProduct(data: CreateProductData) {
      this.loading = true
      this.error = null
      
      try {
        const newProduct = await productService.createProduct(data)
        this.products.unshift(newProduct)
        return newProduct
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao criar produto'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(data: UpdateProductData) {
      this.loading = true
      this.error = null
      
      try {
        const updatedProduct = await productService.updateProduct(data)
        const index = this.products.findIndex(p => p.id === data.id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        if (this.currentProduct?.id === data.id) {
          this.currentProduct = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao atualizar produto'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: string) {
      this.loading = true
      this.error = null
      
      try {
        await productService.deleteProduct(id)
        this.products = this.products.filter(p => p.id !== id)
        if (this.currentProduct?.id === id) {
          this.currentProduct = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao remover produto'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        this.categories = await productService.getCategories()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar categorias'
      }
    },

    updateFilters(newFilters: Partial<ProductFilters>) {
      this.filters = { ...this.filters, ...newFilters }
      this.pagination.currentPage = 1
    },

    updateSearch(search: string) {
      this.filters.search = search
      this.pagination.currentPage = 1
    },

    updateCategory(category: string) {
      this.filters.category = category
      this.pagination.currentPage = 1
    },

    updatePriceRange(minPrice: number | null, maxPrice: number | null) {
      this.filters.minPrice = minPrice
      this.filters.maxPrice = maxPrice
      this.pagination.currentPage = 1
    },

    updateSort(sortBy: string, sortOrder: string) {
      this.filters.sortBy = sortBy as ProductFilters['sortBy']
      this.filters.sortOrder = sortOrder as ProductFilters['sortOrder']
      this.pagination.currentPage = 1
    },

    nextPage() {
      if (this.hasNextPage) {
        this.fetchProducts(this.pagination.currentPage + 1)
      }
    },

    previousPage() {
      if (this.hasPreviousPage) {
        this.fetchProducts(this.pagination.currentPage - 1)
      }
    },

    goToPage(page: number) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page
        this.fetchProducts(page)
      }
    },

    clearCurrentProduct() {
      this.currentProduct = null
    },

    clearError() {
      this.error = null
    },

    resetFilters() {
      this.filters = {
        search: '',
        category: 'all',
        minPrice: null,
        maxPrice: null,
        sortBy: 'name',
        sortOrder: 'asc'
      }
      this.pagination.currentPage = 1
    }
  }
})