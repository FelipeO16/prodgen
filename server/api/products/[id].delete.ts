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
  
  const productIndex = mockProducts.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }
  
  const deletedProduct = mockProducts.splice(productIndex, 1)[0]
  
  return {
    success: true,
    data: deletedProduct,
    message: 'Product deleted successfully'
  }
})

