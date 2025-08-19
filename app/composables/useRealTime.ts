import type { Product } from '~/types/product'

interface RealTimeEvent {
  type: 'product_created' | 'product_updated' | 'product_deleted' | 'bulk_operation'
  data: Record<string, unknown>
  timestamp: Date
}

interface RealTimeState {
  isConnected: boolean
  events: RealTimeEvent[]
  lastEvent: RealTimeEvent | null
}

export const useRealTime = () => {
  const state = reactive<RealTimeState>({
    isConnected: false,
    events: [],
    lastEvent: null
  })

  const productsStore = useProductsStore()
  const toast = useToast()

  const connect = () => {
    state.isConnected = true
    
    if (import.meta.client) {
      window.addEventListener('focus', handleWindowFocus)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }
  }

  const disconnect = () => {
    state.isConnected = false
    
    if (import.meta.client) {
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  const handleWindowFocus = () => {
    if (state.isConnected) {
      refreshData()
    }
  }

  const handleOnline = () => {
    state.isConnected = true
    refreshData()
    
    toast.add({
      title: $t('realtime.online.title'),
      description: $t('realtime.online.description'),
      color: 'success'
    })
  }

  const handleOffline = () => {
    state.isConnected = false
    
    toast.add({
      title: $t('realtime.offline.title'),
      description: $t('realtime.offline.description'),
      color: 'warning'
    })
  }

  const refreshData = async () => {
    try {
      await productsStore.fetchProducts()
      await productsStore.fetchCategories()
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  const addEvent = (event: RealTimeEvent) => {
    state.events.unshift(event)
    state.lastEvent = event
    
    if (state.events.length > 50) {
      state.events = state.events.slice(0, 50)
    }
  }

  const simulateProductCreated = (product: Product) => {
    const event: RealTimeEvent = {
      type: 'product_created',
      data: product,
      timestamp: new Date()
    }
    
    addEvent(event)
    
    toast.add({
      title: $t('realtime.product.created.title'),
      description: $t('realtime.product.created.description', { name: product.name }),
      color: 'success',
      icon: 'lucide:plus-circle'
    })
  }

  const simulateProductUpdated = (product: Product) => {
    const event: RealTimeEvent = {
      type: 'product_updated',
      data: product,
      timestamp: new Date()
    }
    
    addEvent(event)
    
    toast.add({
      title: $t('realtime.product.updated.title'),
      description: $t('realtime.product.updated.description', { name: product.name }),
      color: 'primary',
      icon: 'lucide:edit-3'
    })
  }

  const simulateProductDeleted = (productId: string, productName: string) => {
    const event: RealTimeEvent = {
      type: 'product_deleted',
      data: { id: productId, name: productName },
      timestamp: new Date()
    }
    
    addEvent(event)
    
    toast.add({
      title: $t('realtime.product.deleted.title'),
      description: $t('realtime.product.deleted.description', { name: productName }),
      color: 'error',
      icon: 'lucide:trash-2'
    })
  }

  const simulateBulkOperation = (operation: Record<string, unknown>) => {
    const event: RealTimeEvent = {
      type: 'bulk_operation',
      data: operation,
      timestamp: new Date()
    }
    
    addEvent(event)
    
    toast.add({
      title: $t('realtime.bulk.title'),
      description: $t('realtime.bulk.description', { 
        type: operation.type, 
        count: operation.items.length 
      }),
      color: 'info',
      icon: 'lucide:layers'
    })
  }

  const clearEvents = () => {
    state.events = []
    state.lastEvent = null
  }

  const getEventIcon = (type: RealTimeEvent['type']) => {
    switch (type) {
      case 'product_created':
        return 'lucide:plus-circle'
      case 'product_updated':
        return 'lucide:edit-3'
      case 'product_deleted':
        return 'lucide:trash-2'
      case 'bulk_operation':
        return 'lucide:layers'
      default:
        return 'lucide:activity'
    }
  }

  const getEventColor = (type: RealTimeEvent['type']) => {
    switch (type) {
      case 'product_created':
        return 'success'
      case 'product_updated':
        return 'primary'
      case 'product_deleted':
        return 'error'
      case 'bulk_operation':
        return 'info'
      default:
        return 'neutral'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return $t('realtime.time.seconds', { count: seconds })
    } else if (minutes < 60) {
      return $t('realtime.time.minutes', { count: minutes })
    } else if (hours < 24) {
      return $t('realtime.time.hours', { count: hours })
    } else {
      return timestamp.toLocaleDateString()
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    ...toRefs(state),
    connect,
    disconnect,
    refreshData,
    addEvent,
    simulateProductCreated,
    simulateProductUpdated,
    simulateProductDeleted,
    simulateBulkOperation,
    clearEvents,
    getEventIcon,
    getEventColor,
    formatTimestamp
  }
}
