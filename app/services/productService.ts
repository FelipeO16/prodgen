import type { 
  Product, 
  ProductFilters, 
  ProductsResponse, 
  CreateProductData, 
  UpdateProductData, 
  ApiResponse,
  ProductCategory
} from '~~/types/product'

export class ProductService {
  private baseUrl = '/api/products'

  async getProducts(filters?: Partial<ProductFilters>, page = 1, limit = 12): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters?.minPrice !== null && filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    const response = await $fetch<ApiResponse<ProductsResponse>>(`${this.baseUrl}?${params.toString()}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch products')
    }
    
    return response.data
  }

  async getProduct(id: string): Promise<Product> {
    const response = await $fetch<ApiResponse<Product>>(`${this.baseUrl}/${id}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch product')
    }
    
    return response.data
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await $fetch<ApiResponse<Product>>(this.baseUrl, {
      method: 'POST',
      body: data
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create product')
    }
    
    return response.data
  }

  async updateProduct(data: UpdateProductData): Promise<Product> {
    const response = await $fetch<ApiResponse<Product>>(`${this.baseUrl}/${data.id}`, {
      method: 'PUT',
      body: data
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update product')
    }
    
    return response.data
  }

  async deleteProduct(id: string): Promise<Product> {
    const response = await $fetch<ApiResponse<Product>>(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete product')
    }
    
    return response.data
  }

  async getCategories(): Promise<ProductCategory[]> {
    const response = await $fetch<ApiResponse<ProductCategory[]>>(`${this.baseUrl}/categories`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch categories')
    }
    
    return response.data
  }
}

export const productService = new ProductService()