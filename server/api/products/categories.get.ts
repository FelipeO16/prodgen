export default defineEventHandler(async (event) => {
  const { simulateLatency } = await import('~~/server/utils/productHelpers')
  const { PRODUCT_CATEGORIES } = await import('~~/types/product')
  
  await simulateLatency(100, 200)
  
  return {
    success: true,
    data: PRODUCT_CATEGORIES
  }
})

