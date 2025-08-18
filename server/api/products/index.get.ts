export default defineEventHandler(async (event) => {
  const { mockProducts } = await import('~~/server/utils/mockData')
  const { simulateLatency, filterProducts, sortProducts, paginateProducts } = await import('~~/server/utils/productHelpers')
  
  await simulateLatency()
  
  const query = getQuery(event)
  
  const filters = {
    search: query.search as string || '',
    category: query.category as string || 'all',
    minPrice: query.minPrice ? Number(query.minPrice) : null,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : null,
    sortBy: query.sortBy as string || 'name',
    sortOrder: query.sortOrder as string || 'asc'
  }
  
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 12
  
  let filteredProducts = filterProducts(mockProducts, filters)
  filteredProducts = sortProducts(filteredProducts, filters.sortBy, filters.sortOrder)
  
  const response = paginateProducts(filteredProducts, page, limit)
  
  return {
    success: true,
    data: response
  }
})

