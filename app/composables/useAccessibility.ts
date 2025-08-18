export function useAccessibility() {
  const announcements = ref<string[]>([])
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announcements.value.push(message)
    
    if (import.meta.client) {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', priority)
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  const getAriaLabel = (action: string, item?: string) => {
    switch (action) {
      case 'edit':
        return `Editar ${item || 'item'}`
      case 'delete':
        return `Remover ${item || 'item'}`
      case 'view':
        return `Ver detalhes de ${item || 'item'}`
      case 'sort':
        return `Ordenar por ${item || 'critério'}`
      case 'filter':
        return `Filtrar por ${item || 'categoria'}`
      case 'search':
        return 'Buscar produtos'
      case 'clear':
        return 'Limpar filtros'
      default:
        return action
    }
  }

  const handleKeyboardNavigation = (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onSelect?: (index: number) => void
  ) => {
    let newIndex = currentIndex

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowUp':
        event.preventDefault()
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = items.length - 1
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        onSelect?.(currentIndex)
        return currentIndex
    }

    items[newIndex]?.focus()
    return newIndex
  }

  return {
    announcements,
    announce,
    trapFocus,
    getAriaLabel,
    handleKeyboardNavigation
  }
}
