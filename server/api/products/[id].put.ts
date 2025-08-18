export default defineEventHandler(async (event) => {
  const { mockProducts } = await import('~~/server/utils/mockData')
  const { simulateLatency } = await import('~~/server/utils/productHelpers')
  
  await simulateLatency()
  
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
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
  
  if (body.price && body.price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be greater than 0'
    })
  }
  
  if (body.stock && body.stock < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Stock cannot be negative'
    })
  }
  
  const updatedProduct = {
    ...mockProducts[productIndex],
    ...body,
    id,
    updatedAt: new Date().toISOString()
  }
  
  mockProducts[productIndex] = updatedProduct
  
  return {
    success: true,
    data: updatedProduct,
    message: 'Product updated successfully'
  }
})

