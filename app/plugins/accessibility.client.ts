export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('user-is-tabbing')
      }
    })

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing')
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.blur) {
          activeElement.blur()
        }
      }
    })

    const prefers = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefers.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0s')
    }
  }
})

