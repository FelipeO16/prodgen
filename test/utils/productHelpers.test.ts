import { describe, it, expect } from 'vitest'
import { filterProducts, sortProducts, paginateProducts, generateId } from '~/server/utils/productHelpers'

const mockProducts = [
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
  },
  {
    id: '3',
    name: 'Camiseta Premium',
    description: 'Camiseta de algodão',
    price: 89.99,
    category: 'Roupas',
    image: 'https://example.com/camiseta.jpg',
    stock: 50,
    rating: 4.5,
    featured: false,
    createdAt: '2025-01-13T09:15:00Z',
    updatedAt: '2025-01-13T09:15:00Z'
  }
]

describe('Product Helpers', () => {
  describe('filterProducts', () => {
    it('should filter by search term', () => {
      const filters = { search: 'iPhone' }
      const result = filterProducts(mockProducts, filters)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('iPhone 15 Pro')
    })

    it('should filter by category', () => {
      const filters = { category: 'Eletrônicos' }
      const result = filterProducts(mockProducts, filters)
      
      expect(result).toHaveLength(2)
      expect(result.every(p => p.category === 'Eletrônicos')).toBe(true)
    })

    it('should filter by price range', () => {
      const filters = { minPrice: 1000, maxPrice: 10000 }
      const result = filterProducts(mockProducts, filters)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('iPhone 15 Pro')
    })

    it('should filter by multiple criteria', () => {
      const filters = { 
        search: 'Apple',
        category: 'Eletrônicos',
        minPrice: 5000
      }
      const result = filterProducts(mockProducts, filters)
      
      expect(result).toHaveLength(2)
      expect(result.every(p => p.category === 'Eletrônicos')).toBe(true)
    })

    it('should return all products when no filters applied', () => {
      const result = filterProducts(mockProducts, {})
      
      expect(result).toHaveLength(3)
    })
  })

  describe('sortProducts', () => {
    it('should sort by name ascending', () => {
      const result = sortProducts(mockProducts, 'name', 'asc')
      
      expect(result[0].name).toBe('Camiseta Premium')
      expect(result[1].name).toBe('iPhone 15 Pro')
      expect(result[2].name).toBe('MacBook Air M3')
    })

    it('should sort by name descending', () => {
      const result = sortProducts(mockProducts, 'name', 'desc')
      
      expect(result[0].name).toBe('MacBook Air M3')
      expect(result[1].name).toBe('iPhone 15 Pro')
      expect(result[2].name).toBe('Camiseta Premium')
    })

    it('should sort by price ascending', () => {
      const result = sortProducts(mockProducts, 'price', 'asc')
      
      expect(result[0].price).toBe(89.99)
      expect(result[1].price).toBe(8999.99)
      expect(result[2].price).toBe(12999.99)
    })

    it('should sort by price descending', () => {
      const result = sortProducts(mockProducts, 'price', 'desc')
      
      expect(result[0].price).toBe(12999.99)
      expect(result[1].price).toBe(8999.99)
      expect(result[2].price).toBe(89.99)
    })

    it('should sort by rating', () => {
      const result = sortProducts(mockProducts, 'rating', 'desc')
      
      expect(result[0].rating).toBe(4.9)
      expect(result[1].rating).toBe(4.8)
      expect(result[2].rating).toBe(4.5)
    })

    it('should sort by creation date', () => {
      const result = sortProducts(mockProducts, 'createdAt', 'desc')
      
      expect(result[0].createdAt).toBe('2025-01-15T10:30:00Z')
      expect(result[1].createdAt).toBe('2025-01-14T14:20:00Z')
      expect(result[2].createdAt).toBe('2025-01-13T09:15:00Z')
    })
  })

  describe('paginateProducts', () => {
    it('should paginate products correctly', () => {
      const result = paginateProducts(mockProducts, 1, 2)
      
      expect(result.products).toHaveLength(2)
      expect(result.meta.currentPage).toBe(1)
      expect(result.meta.totalPages).toBe(2)
      expect(result.meta.totalItems).toBe(3)
      expect(result.meta.itemsPerPage).toBe(2)
    })

    it('should return second page', () => {
      const result = paginateProducts(mockProducts, 2, 2)
      
      expect(result.products).toHaveLength(1)
      expect(result.meta.currentPage).toBe(2)
      expect(result.meta.totalPages).toBe(2)
    })

    it('should handle empty products array', () => {
      const result = paginateProducts([], 1, 10)
      
      expect(result.products).toHaveLength(0)
      expect(result.meta.totalItems).toBe(0)
      expect(result.meta.totalPages).toBe(0)
    })

    it('should handle page beyond total pages', () => {
      const result = paginateProducts(mockProducts, 5, 10)
      
      expect(result.products).toHaveLength(0)
      expect(result.meta.currentPage).toBe(5)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('should generate string IDs', () => {
      const id = generateId()
      
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })
})
