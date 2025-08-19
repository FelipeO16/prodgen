import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const ProductForm = {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  template: `
    <form @submit.prevent="handleSubmit">
      <div class="form-fields">
        <input data-test="name-input" v-model="form.name" type="text" />
        <textarea data-test="description-input" v-model="form.description"></textarea>
        <input data-test="price-input" v-model.number="form.price" type="number" />
        <select data-test="category-select" v-model="form.category">
          <option value="Roupas">Roupas</option>
          <option value="Eletrônicos">Eletrônicos</option>
        </select>
        <input data-test="image-input" v-model="form.image" type="url" />
        <input data-test="stock-input" v-model.number="form.stock" type="number" />
        <input data-test="featured-checkbox" v-model="form.featured" type="checkbox" />
      </div>
      <div class="form-actions">
        <button data-test="submit-button" type="submit">
          {{ product ? 'Atualizar Produto' : 'Criar Produto' }}
        </button>
        <button data-test="cancel-button" type="button" @click="$emit('cancel')">
          Cancelar
        </button>
      </div>
    </form>
  `,
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: 0,
        category: 'Roupas',
        image: '',
        stock: 0,
        featured: false
      },
      errors: {}
    }
  },
  watch: {
    product: {
      immediate: true,
      handler(newProduct) {
        if (newProduct) {
          this.form = { ...newProduct }
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.errors = {}
      
      if (!this.form.name) {
        this.errors.name = 'Nome é obrigatório'
      }
      if (!this.form.description) {
        this.errors.description = 'Descrição é obrigatória'
      }
      if (this.form.price <= 0) {
        this.errors.price = 'Preço deve ser maior que zero'
      }
      if (this.form.stock < 0) {
        this.errors.stock = 'Estoque deve ser maior ou igual a zero'
      }
      
      if (Object.keys(this.errors).length === 0) {
        this.$emit('submit', this.form)
      }
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        price: 0,
        category: 'Roupas',
        image: '',
        stock: 0,
        featured: false
      }
      this.errors = {}
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

describe('ProductForm', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ProductForm, {
      props: {
        product: undefined
      }
    })
  })

  it('renders form fields correctly', () => {
    expect(wrapper.find('[data-test="name-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="description-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="price-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="category-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="image-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="stock-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="featured-checkbox"]').exists()).toBe(true)
  })

  it('initializes with empty form for new product', () => {
    expect(wrapper.vm.form.name).toBe('')
    expect(wrapper.vm.form.description).toBe('')
    expect(wrapper.vm.form.price).toBe(0)
    expect(wrapper.vm.form.category).toBe('Roupas')
    expect(wrapper.vm.form.image).toBe('')
    expect(wrapper.vm.form.stock).toBe(0)
    expect(wrapper.vm.form.featured).toBe(false)
  })

  it('populates form with product data when editing', async () => {
    await wrapper.setProps({ product: mockProduct })
    
    expect(wrapper.vm.form.name).toBe('Test Product')
    expect(wrapper.vm.form.description).toBe('Test description')
    expect(wrapper.vm.form.price).toBe(99.99)
    expect(wrapper.vm.form.category).toBe('Eletrônicos')
    expect(wrapper.vm.form.image).toBe('https://example.com/image.jpg')
    expect(wrapper.vm.form.stock).toBe(10)
    expect(wrapper.vm.form.featured).toBe(true)
  })

  it('emits submit event with form data', async () => {
    const formData = {
      name: 'New Product',
      description: 'New description',
      price: 150.00,
      category: 'Roupas',
      image: 'https://example.com/new-image.jpg',
      stock: 20,
      featured: false
    }

    wrapper.vm.form = formData
    await wrapper.vm.handleSubmit()

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0]).toEqual([formData])
  })

  it('emits cancel event when cancel button is clicked', async () => {
    await wrapper.find('[data-test="cancel-button"]').trigger('click')
    
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('validates required fields', async () => {
    wrapper.vm.form.name = ''
    wrapper.vm.form.description = ''
    wrapper.vm.form.price = 0
    
    await wrapper.vm.handleSubmit()
    
    expect(wrapper.vm.errors.name).toBe('Nome é obrigatório')
    expect(wrapper.vm.errors.description).toBe('Descrição é obrigatória')
    expect(wrapper.vm.errors.price).toBe('Preço deve ser maior que zero')
  })

  it('validates price range', async () => {
    wrapper.vm.form.price = -10
    
    await wrapper.vm.handleSubmit()
    
    expect(wrapper.vm.errors.price).toBe('Preço deve ser maior que zero')
  })

  it('validates stock range', async () => {
    wrapper.vm.form.stock = -5
    
    await wrapper.vm.handleSubmit()
    
    expect(wrapper.vm.errors.stock).toBe('Estoque deve ser maior ou igual a zero')
  })

  it('resets form correctly', async () => {
    wrapper.vm.form.name = 'Test'
    wrapper.vm.form.description = 'Test'
    wrapper.vm.form.price = 100
    
    wrapper.vm.resetForm()
    
    expect(wrapper.vm.form.name).toBe('')
    expect(wrapper.vm.form.description).toBe('')
    expect(wrapper.vm.form.price).toBe(0)
  })

  it('shows correct submit button text', async () => {
    expect(wrapper.find('[data-test="submit-button"]').text()).toContain('Criar Produto')
    
    await wrapper.setProps({ product: mockProduct })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="submit-button"]').text()).toContain('Atualizar Produto')
  })
})
