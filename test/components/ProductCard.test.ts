import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const ProductCard = {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="product-card">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-price">R$ {{ formatPrice(product.price) }}</div>
        <div class="product-category">{{ product.category }}</div>
        <div class="product-rating">{{ product.rating }}</div>
        <div v-if="product.stock < 5" class="stock-warning">Estoque baixo</div>
        <div v-if="product.featured" class="featured-badge">Destaque</div>
      </div>
      <div class="product-actions">
        <button data-test="view-button" @click="$emit('view', product)">Ver</button>
        <button data-test="edit-button" @click="$emit('edit', product)">Editar</button>
        <button data-test="delete-button" @click="$emit('delete', product)">Excluir</button>
      </div>
    </div>
  `,
  methods: {
    formatPrice(price: number) {
      return price.toFixed(2).replace('.', ',')
    }
  }
}

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  category: 'Eletrônicos',
  image: 'https://example.com/image.jpg',
  stock: 10,
  rating: 4.5,
  featured: true,
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-01-15T10:30:00Z'
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('R$ 99,99')
    expect(wrapper.text()).toContain('Eletrônicos')
    expect(wrapper.text()).toContain('4.5')
  })

  it('emits view event when view button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('[data-test="view-button"]').trigger('click')
    
    expect(wrapper.emitted('view')).toBeTruthy()
    expect(wrapper.emitted('view')?.[0]).toEqual([mockProduct])
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('[data-test="edit-button"]').trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockProduct])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('[data-test="delete-button"]').trigger('click')
    
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockProduct])
  })

  it('shows correct stock status', () => {
    const lowStockProduct = { ...mockProduct, stock: 2 }
    const wrapper = mount(ProductCard, {
      props: {
        product: lowStockProduct
      }
    })

    expect(wrapper.text()).toContain('Estoque baixo')
  })

  it('shows featured badge when product is featured', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    expect(wrapper.text()).toContain('Destaque')
  })
})
