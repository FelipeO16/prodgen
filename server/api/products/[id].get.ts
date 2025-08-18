export default defineEventHandler(async (event) => {
  const { mockProducts } = await import('~~/server/utils/mockData')
  const { simulateLatency } = await import('~~/server/utils/productHelpers')
  
  await simulateLatency()
  
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }
  
  const product = mockProducts.find(p => p.id === id)
  
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }
  
  return {
    success: true,
    data: product
  }
})

