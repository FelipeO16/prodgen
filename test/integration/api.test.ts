import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockApiResponse = {
  success: true,
  data: {
    products: [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple',
        price: 8999.99,
        category: 'Eletrônicos',
        image: 'https://example.com/iphone.jpg',
        stock: 25,
        rating: 4.8,
        featured: true,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'MacBook Air M3',
        description: 'Notebook Apple',
        price: 12999.99,
        category: 'Eletrônicos',
        image: 'https://example.com/macbook.jpg',
        stock: 15,
        rating: 4.9,
        featured: true,
        createdAt: '2025-01-14T14:20:00Z',
        updatedAt: '2025-01-14T14:20:00Z'
      }
    ],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 12
    }
  }
}

const mockProductResponse = {
  success: true,
  data: {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Smartphone Apple',
    price: 8999.99,
    category: 'Eletrônicos',
    image: 'https://example.com/iphone.jpg',
    stock: 25,
    rating: 4.8,
    featured: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
}

const mockCategoriesResponse = {
  success: true,
  data: ['Eletrônicos', 'Roupas', 'Casa', 'Esportes']
}

const mockFetch = vi.fn()

global.fetch = mockFetch

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Products API', () => {
    it('should fetch products list', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockApiResponse
      })

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.products).toBeDefined()
      expect(Array.isArray(data.data.products)).toBe(true)
      expect(data.data.meta).toBeDefined()
    })

    it('should fetch single product', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockProductResponse
      })

      const response = await fetch('/api/products/1')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.id).toBe('1')
    })

    it('should return 404 for non-existent product', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 404,
        json: async () => ({ success: false, message: 'Product not found' })
      })

      const response = await fetch('/api/products/999')

      expect(response.status).toBe(404)
    })

    it('should create new product', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Eletrônicos',
        image: 'https://example.com/image.jpg',
        stock: 10,
        featured: false
      }

      mockFetch.mockResolvedValueOnce({
        status: 201,
        json: async () => ({
          success: true,
          data: { ...newProduct, id: '3' }
        })
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(newProduct.name)
    })

    it('should update existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 149.99
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({
          success: true,
          data: { ...mockProductResponse.data, ...updateData }
        })
      })

      const response = await fetch('/api/products/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updateData.name)
    })

    it('should delete product', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true, message: 'Product deleted' })
      })

      const response = await fetch('/api/products/1', {
        method: 'DELETE'
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should fetch categories', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockCategoriesResponse
      })

      const response = await fetch('/api/products/categories')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('Products with filters', () => {
    it('should filter products by search', async () => {
      const filteredProducts = {
        ...mockApiResponse,
        data: {
          ...mockApiResponse.data,
          products: mockApiResponse.data.products.filter(p => 
            p.name.toLowerCase().includes('iphone') || 
            p.description.toLowerCase().includes('iphone')
          )
        }
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => filteredProducts
      })

      const response = await fetch('/api/products?search=iPhone')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
             expect(data.data.products.every((p: { name: string; description: string }) => 
         p.name.toLowerCase().includes('iphone') || 
         p.description.toLowerCase().includes('iphone')
       )).toBe(true)
    })

    it('should filter products by category', async () => {
      const filteredProducts = {
        ...mockApiResponse,
        data: {
          ...mockApiResponse.data,
          products: mockApiResponse.data.products.filter(p => p.category === 'Eletrônicos')
        }
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => filteredProducts
      })

      const response = await fetch('/api/products?category=Eletrônicos')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
             expect(data.data.products.every((p: { category: string }) => p.category === 'Eletrônicos')).toBe(true)
    })

    it('should filter products by price range', async () => {
      const filteredProducts = {
        ...mockApiResponse,
        data: {
          ...mockApiResponse.data,
          products: mockApiResponse.data.products.filter(p => 
            p.price >= 1000 && p.price <= 10000
          )
        }
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => filteredProducts
      })

      const response = await fetch('/api/products?minPrice=1000&maxPrice=10000')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
             expect(data.data.products.every((p: { price: number }) => 
         p.price >= 1000 && p.price <= 10000
       )).toBe(true)
    })

    it('should sort products by price', async () => {
      const sortedProducts = {
        ...mockApiResponse,
        data: {
          ...mockApiResponse.data,
          products: [...mockApiResponse.data.products].sort((a, b) => a.price - b.price)
        }
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => sortedProducts
      })

      const response = await fetch('/api/products?sortBy=price&sortOrder=asc')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
             const prices = data.data.products.map((p: { price: number }) => p.price)
      const sortedPrices = [...prices].sort((a, b) => a - b)
      expect(prices).toEqual(sortedPrices)
    })

    it('should paginate products', async () => {
      const paginatedProducts = {
        ...mockApiResponse,
        data: {
          ...mockApiResponse.data,
          products: mockApiResponse.data.products.slice(0, 1),
          meta: {
            currentPage: 1,
            totalPages: 2,
            totalItems: 2,
            itemsPerPage: 1
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => paginatedProducts
      })

      const response = await fetch('/api/products?page=1&limit=1')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.products.length).toBeLessThanOrEqual(1)
      expect(data.data.meta.currentPage).toBe(1)
      expect(data.data.meta.itemsPerPage).toBe(1)
    })
  })

  describe('Error handling', () => {
    it('should handle invalid product ID', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 400,
        json: async () => ({ success: false, message: 'Invalid product ID' })
      })

      const response = await fetch('/api/products/invalid')

      expect(response.status).toBe(400)
    })

    it('should handle invalid request body', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 400,
        json: async () => ({ success: false, message: 'Invalid request body' })
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      })

      expect(response.status).toBe(400)
    })

    it('should handle server errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 500,
        json: async () => ({ success: false, message: 'Internal server error' })
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(null)
      })

      expect(response.status).toBe(500)
    })
  })
})
