import { defineStore } from 'pinia'
import type { Product } from '~~/types/product'

interface BulkOperation {
  id: string
  type: 'delete' | 'update' | 'export'
  items: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
  error?: string
}

interface BulkOperationsState {
  selectedItems: Set<string>
  operations: BulkOperation[]
  isSelectMode: boolean
  isLoading: boolean
}

export const useBulkOperationsStore = defineStore('bulkOperations', () => {
  const state = reactive<BulkOperationsState>({
    selectedItems: new Set(),
    operations: [],
    isSelectMode: false,
    isLoading: false
  })

  const selectedCount = computed(() => state.selectedItems.size)
  const hasSelection = computed(() => state.selectedItems.size > 0)
  const selectedItemsArray = computed(() => Array.from(state.selectedItems))

  const toggleSelectMode = () => {
    state.isSelectMode = !state.isSelectMode
    if (!state.isSelectMode) {
      clearSelection()
    }
  }

  const selectItem = (id: string) => {
    state.selectedItems.add(id)
  }

  const deselectItem = (id: string) => {
    state.selectedItems.delete(id)
  }

  const toggleItem = (id: string) => {
    if (state.selectedItems.has(id)) {
      deselectItem(id)
    } else {
      selectItem(id)
    }
  }

  const selectAll = (items: Product[]) => {
    items.forEach(item => state.selectedItems.add(item.id))
  }

  const deselectAll = () => {
    state.selectedItems.clear()
  }

  const clearSelection = () => {
    state.selectedItems.clear()
    state.isSelectMode = false
  }

  const createOperation = (type: BulkOperation['type'], items: string[]): BulkOperation => {
    const operation: BulkOperation = {
      id: crypto.randomUUID(),
      type,
      items,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    }
    
    state.operations.unshift(operation)
    return operation
  }

  const updateOperation = (id: string, updates: Partial<BulkOperation>) => {
    const operation = state.operations.find(op => op.id === id)
    if (operation) {
      Object.assign(operation, updates)
    }
  }

  const deleteOperation = (id: string) => {
    const index = state.operations.findIndex(op => op.id === id)
    if (index > -1) {
      state.operations.splice(index, 1)
    }
  }

  const bulkDelete = async () => {
    if (!hasSelection.value) return

    const operation = createOperation('delete', selectedItemsArray.value)
    updateOperation(operation.id, { status: 'processing' })

    try {
      const productsStore = useProductsStore()
      const total = selectedItemsArray.value.length
      
      for (let i = 0; i < total; i++) {
        const productId = selectedItemsArray.value[i]
        await productsStore.deleteProduct(productId)
        
        const progress = ((i + 1) / total) * 100
        updateOperation(operation.id, { progress })
      }

      updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100, 
        completedAt: new Date() 
      })

      clearSelection()
      await productsStore.fetchProducts()
      
      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.delete.success'),
        description: $t('bulkOperations.delete.description', { count: total }),
        color: 'success'
      })
    } catch (error) {
      updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date()
      })

      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.delete.error'),
        description: error instanceof Error ? error.message : $t('common.error'),
        color: 'error'
      })
    }
  }

  const bulkUpdate = async (updates: Partial<Product>) => {
    if (!hasSelection.value) return

    const operation = createOperation('update', selectedItemsArray.value)
    updateOperation(operation.id, { status: 'processing' })

    try {
      const productsStore = useProductsStore()
      const total = selectedItemsArray.value.length
      
      for (let i = 0; i < total; i++) {
        const productId = selectedItemsArray.value[i]
        await productsStore.updateProduct(productId, updates)
        
        const progress = ((i + 1) / total) * 100
        updateOperation(operation.id, { progress })
      }

      updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100, 
        completedAt: new Date() 
      })

      clearSelection()
      await productsStore.fetchProducts()
      
      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.update.success'),
        description: $t('bulkOperations.update.description', { count: total }),
        color: 'success'
      })
    } catch (error) {
      updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date()
      })

      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.update.error'),
        description: error instanceof Error ? error.message : $t('common.error'),
        color: 'error'
      })
    }
  }

  const bulkExport = async (format: 'csv' | 'json' = 'csv') => {
    if (!hasSelection.value) return

    const operation = createOperation('export', selectedItemsArray.value)
    updateOperation(operation.id, { status: 'processing' })

    try {
      const productsStore = useProductsStore()
      const products = productsStore.products.filter(p => 
        selectedItemsArray.value.includes(p.id)
      )

      let content = ''
      let filename = ''

      if (format === 'csv') {
        content = generateCSV(products)
        filename = `produtos_${new Date().toISOString().split('T')[0]}.csv`
      } else {
        content = JSON.stringify(products, null, 2)
        filename = `produtos_${new Date().toISOString().split('T')[0]}.json`
      }

      downloadFile(content, filename, format === 'csv' ? 'text/csv' : 'application/json')

      updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100, 
        completedAt: new Date() 
      })

      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.export.success'),
        description: $t('bulkOperations.export.description', { count: products.length }),
        color: 'success'
      })
    } catch (error) {
      updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date()
      })

      const toast = useToast()
      toast.add({
        title: $t('bulkOperations.export.error'),
        description: error instanceof Error ? error.message : $t('common.error'),
        color: 'error'
      })
    }
  }

  const generateCSV = (products: Product[]): string => {
    const headers = ['ID', 'Nome', 'Descrição', 'Preço', 'Categoria', 'Estoque', 'Destaque', 'Avaliação']
    const rows = products.map(p => [
      p.id,
      p.name,
      p.description,
      p.price.toString(),
      p.category,
      p.stock.toString(),
      p.featured ? 'Sim' : 'Não',
      p.rating.toString()
    ])

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    ...toRefs(state),
    selectedCount,
    hasSelection,
    selectedItemsArray,
    toggleSelectMode,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    clearSelection,
    bulkDelete,
    bulkUpdate,
    bulkExport,
    updateOperation,
    deleteOperation
  }
})
