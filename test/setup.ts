import { vi } from 'vitest'

vi.mock('#app', () => ({
  useRoute: () => ({
    path: '/',
    query: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  useColorMode: () => ({
    preference: 'light',
    value: 'light'
  }),
  useToast: () => ({
    add: vi.fn()
  }),
  useModal: () => ({
    open: vi.fn(),
    close: vi.fn()
  }),
  navigateTo: vi.fn(),
  $fetch: vi.fn()
}))

vi.mock('#ui', () => ({
  UButton: {
    name: 'UButton',
    template: '<button><slot /></button>'
  },
  UCard: {
    name: 'UCard',
    template: '<div><slot /></div>'
  },
  UIcon: {
    name: 'UIcon',
    template: '<span><slot /></span>'
  },
  UBadge: {
    name: 'UBadge',
    template: '<span><slot /></span>'
  },
  UInput: {
    name: 'UInput',
    template: '<input />'
  },
  UTextarea: {
    name: 'UTextarea',
    template: '<textarea />'
  },
  USelect: {
    name: 'USelect',
    template: '<select><slot /></select>'
  },
  UCheckbox: {
    name: 'UCheckbox',
    template: '<input type="checkbox" />'
  },
  UFormField: {
    name: 'UFormField',
    template: '<div><slot /></div>'
  },
  UDropdownMenu: {
    name: 'UDropdownMenu',
    template: '<div><slot /></div>'
  }
}))


global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
