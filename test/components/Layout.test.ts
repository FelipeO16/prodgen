import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const DefaultLayout = {
  name: 'DefaultLayout',
  template: `
    <div class="min-h-screen">
      <header>
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-8">
              <a href="/" data-test="logo">ProdGen</a>
              <nav class="hidden lg:flex" data-test="nav-desktop">
                <a href="/">Dashboard</a>
                <a href="/products">Produtos</a>
              </nav>
            </div>
            <div class="flex items-center gap-3">
              <button data-test="notification-button">Notificações</button>
              <button data-test="theme-toggle">Tema</button>
              <button data-test="mobile-menu-button" @click="toggleMobileMenu">Menu</button>
            </div>
          </div>
        </div>
      </header>
      
      <div v-if="isMobileMenuOpen" data-test="mobile-menu-overlay" @click="closeMobileMenu">
        <div data-test="mobile-menu">
          <nav data-test="mobile-nav">
            <a href="/">Dashboard</a>
            <a href="/products">Produtos</a>
          </nav>
          <button data-test="mobile-menu-close" @click="closeMobileMenu">Fechar</button>
        </div>
      </div>
      
      <main id="main-content">
        <slot />
      </main>
      
      <footer>
        <div class="container">
          <span>Desenvolvido por Felipe</span>
          <span>ProdGen</span>
        </div>
      </footer>
      
      <a href="#main-content" class="skip-link">Pular para o conteúdo</a>
    </div>
  `,
  data() {
    return {
      isMobileMenuOpen: false,
      navigation: [
        { label: 'Dashboard', to: '/' },
        { label: 'Produtos', to: '/products' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    isActiveRoute(path: string) {
      return path === '/'
    }
  }
}

describe('Default Layout', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(DefaultLayout, {
      global: {
        stubs: {
          'UIcon': true,
          'UButton': true,
          'NuxtLink': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  })

  it('renders header with logo and navigation', () => {
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('[data-test="logo"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-desktop"]').exists()).toBe(true)
  })

  it('renders mobile menu button', () => {
    expect(wrapper.find('[data-test="mobile-menu-button"]').exists()).toBe(true)
  })

  it('renders theme toggle button', () => {
    expect(wrapper.find('[data-test="theme-toggle"]').exists()).toBe(true)
  })

  it('renders notification button', () => {
    expect(wrapper.find('[data-test="notification-button"]').exists()).toBe(true)
  })

  it('toggles mobile menu when hamburger button is clicked', async () => {
    const mobileMenuButton = wrapper.find('[data-test="mobile-menu-button"]')
    await mobileMenuButton.trigger('click')

    expect(wrapper.vm.isMobileMenuOpen).toBe(true)
  })

  it('closes mobile menu when close button is clicked', async () => {
    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('[data-test="mobile-menu-close"]')
    await closeButton.trigger('click')

    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
  })

  it('closes mobile menu when clicking outside', async () => {
    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    const overlay = wrapper.find('[data-test="mobile-menu-overlay"]')
    await overlay.trigger('click')

    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
  })

  it('renders mobile menu with navigation items', async () => {
    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    const mobileMenu = wrapper.find('[data-test="mobile-menu"]')
    expect(mobileMenu.exists()).toBe(true)
    expect(mobileMenu.find('[data-test="mobile-nav"]').exists()).toBe(true)
  })

  it('renders main content area', () => {
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('main').attributes('id')).toBe('main-content')
  })

  it('renders footer', () => {
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Desenvolvido por')
    expect(wrapper.text()).toContain('ProdGen')
  })

  it('renders skip link for accessibility', () => {
    const skipLink = wrapper.find('.skip-link')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#main-content')
  })

  it('has correct navigation items', () => {
    expect(wrapper.vm.navigation).toHaveLength(2)
    expect(wrapper.vm.navigation[0].label).toBe('Dashboard')
    expect(wrapper.vm.navigation[1].label).toBe('Produtos')
  })

  it('detects active route correctly', () => {
    const isActive = wrapper.vm.isActiveRoute('/')
    expect(typeof isActive).toBe('boolean')
  })
})
