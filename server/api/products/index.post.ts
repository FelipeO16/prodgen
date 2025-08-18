export default defineEventHandler(async (event) => {
  const { mockProducts } = await import('~~/server/utils/mockData')
  const { simulateLatency, generateId } = await import('~~/server/utils/productHelpers')
  
  await simulateLatency()
  
  const body = await readBody(event)
  
  if (!body.name || !body.description || !body.price || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, description, price, category'
    })
  }
  
  if (body.price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be greater than 0'
    })
  }
  
  if (body.stock < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Stock cannot be negative'
    })
  }
  
  const newProduct = {
    id: generateId(),
    name: body.name,
    description: body.description,
    price: Number(body.price),
    category: body.category,
    image: body.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    stock: Number(body.stock) || 0,
    rating: 0,
    featured: Boolean(body.featured) || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockProducts.push(newProduct)
  
  return {
    success: true,
    data: newProduct,
    message: 'Product created successfully'
  }
})

