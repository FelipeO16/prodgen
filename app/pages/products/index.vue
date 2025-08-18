<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Produtos'
})

useSeoMeta({
  title: 'Produtos - ProdGen',
  description: 'Gerencie seu catálogo de produtos com filtros avançados e busca inteligente.',
  robots: 'noindex'
})

const productsStore = useProductsStore()
const { 
  products, 
  loading, 
  error, 
  filters, 
  pagination, 
  categories,
  hasProducts
} = storeToRefs(productsStore)

const showDeleteModal = ref(false)
const productToDelete = ref<string | null>(null)

const categoryMenuOptions = computed(() => [
  { 
    label: 'Todas as categorias', 
    value: 'all',
    onSelect: () => updateCategory('all')
  },
  ...categories.value.map((cat: string) => ({ 
    label: cat, 
    value: cat,
    onSelect: () => updateCategory(cat)
  }))
])

const searchProducts = (searchTerm: string) => {
  productsStore.updateSearch(searchTerm)
  productsStore.fetchProducts()
}

const updateCategory = (category: string) => {
  productsStore.updateCategory(category)
  productsStore.fetchProducts()
}

const updateSort = (sortBy: string, sortOrder: string) => {
  productsStore.updateSort(sortBy, sortOrder)
  productsStore.fetchProducts()
}

const updatePriceRange = (minPrice: number | null, maxPrice: number | null) => {
  productsStore.updatePriceRange(minPrice, maxPrice)
  productsStore.fetchProducts()
}

const clearAllFilters = () => {
  productsStore.resetFilters()
  productsStore.fetchProducts()
}

const handleDeleteProduct = (productId: string) => {
  productToDelete.value = productId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (productToDelete.value) {
    try {
      await productsStore.deleteProduct(productToDelete.value)
      const toast = useToast()
      toast.add({
        title: 'Produto removido',
        description: 'O produto foi removido com sucesso.',
        color: 'success'
      })
      await productsStore.fetchProducts(pagination.value.currentPage)
    } catch (error) {
      const toast = useToast()
      toast.add({
        title: 'Erro ao remover produto',
        description: error instanceof Error ? error.message : 'Erro inesperado',
        color: 'error'
      })
    } finally {
      showDeleteModal.value = false
      productToDelete.value = null
    }
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const retryLoad = () => {
  productsStore.fetchProducts()
}

const getVisiblePages = () => {
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const pages = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
}

const sortMenuOptions = [
  { 
    label: 'Nome (A-Z)', 
    value: 'name-asc',
    onSelect: () => updateSort('name', 'asc')
  },
  { 
    label: 'Nome (Z-A)', 
    value: 'name-desc',
    onSelect: () => updateSort('name', 'desc')
  },
  { 
    label: 'Preço (Menor)', 
    value: 'price-asc',
    onSelect: () => updateSort('price', 'asc')
  },
  { 
    label: 'Preço (Maior)', 
    value: 'price-desc',
    onSelect: () => updateSort('price', 'desc')
  },
  { 
    label: 'Avaliação', 
    value: 'rating-desc',
    onSelect: () => updateSort('rating', 'desc')
  },
  { 
    label: 'Mais Recente', 
    value: 'createdAt-desc',
    onSelect: () => updateSort('createdAt', 'desc')
  },
  { 
    label: 'Mais Antigo', 
    value: 'createdAt-asc',
    onSelect: () => updateSort('createdAt', 'asc')
  }
]

const getSortLabel = () => {
  const sortLabels = {
    'name-asc': 'Nome (A-Z)',
    'name-desc': 'Nome (Z-A)',
    'price-asc': 'Preço (Menor)',
    'price-desc': 'Preço (Maior)',
    'rating-desc': 'Avaliação',
    'createdAt-desc': 'Mais Recente',
    'createdAt-asc': 'Mais Antigo'
  }
  
  const key = `${filters.value.sortBy}-${filters.value.sortOrder}`
  return sortLabels[key as keyof typeof sortLabels] || 'Ordenar por...'
}

const getCategoryLabel = () => {
  if (filters.value.category === 'all') {
    return 'Todas as categorias'
  }
  return filters.value.category || 'Todas as categorias'
}



onMounted(async () => {
  await productsStore.fetchCategories()
  await productsStore.fetchProducts()
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-6 py-8">
    
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            Produtos
          </h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <UButton
            to="/products/new"
            icon="lucide:plus"
            color="primary"
            variant="solid"
          >
            Adicionar Produto
          </UButton>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      
      <div class="lg:w-80 flex-shrink-0">
        <div class="sticky top-24">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Filtros</h2>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  @click="clearAllFilters"
                >
                  Limpar tudo
                </UButton>
              </div>
            </template>

            <div class="space-y-6">
              
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Buscar produtos
                </label>
                <ClientOnly>
                  <SearchInput
                    :model-value="filters.search"
                    :loading="loading"
                    placeholder="Digite o nome do produto..."
                    @update:model-value="productsStore.updateSearch"
                    @search="searchProducts"
                  />
                  <template #fallback>
                    <UInput
                      placeholder="Carregando..."
                      icon="lucide:search"
                      disabled
                    />
                  </template>
                </ClientOnly>
              </div>

                             
               <div>
                 <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   Categoria
                 </label>
                                   <ClientOnly>
                    <UDropdownMenu
                      :items="categoryMenuOptions"
                      :content="{
                        align: 'start',
                        side: 'top',
                        sideOffset: 8
                      }"
                    >
                      <UButton
                        color="neutral"
                        variant="outline"
                        class="w-full justify-start"
                      >
                        <UIcon name="lucide:tag" class="w-4 h-4 mr-2" />
                        {{ getCategoryLabel() }}
                      </UButton>
                    </UDropdownMenu>
                    <template #fallback>
                      <UButton
                        color="neutral"
                        variant="outline"
                        class="w-full justify-start"
                        disabled
                      >
                        <UIcon name="lucide:tag" class="w-4 h-4 mr-2" />
                        Carregando categorias...
                      </UButton>
                    </template>
                  </ClientOnly>
               </div>

              
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Faixa de preço
                </label>
                <ClientOnly>
                  <PriceRangeFilter
                    :min-price="filters.minPrice"
                    :max-price="filters.maxPrice"
                    @apply="updatePriceRange"
                  />
                  <template #fallback>
                    <div class="space-y-3">
                      <div class="grid grid-cols-2 gap-2">
                        <UInput placeholder="Min" disabled />
                        <UInput placeholder="Max" disabled />
                      </div>
                      <div class="flex gap-2">
                        <UButton size="xs" disabled>Aplicar</UButton>
                        <UButton size="xs" disabled>Limpar</UButton>
                      </div>
                    </div>
                  </template>
                </ClientOnly>
              </div>

                             
               <div>
                 <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   Ordenar por
                 </label>
                    <ClientOnly>
                                         <UDropdownMenu
                       :items="sortMenuOptions"
                       :content="{
                         align: 'start',
                         side: 'top',
                         sideOffset: 8
                       }"
                     >
                      <UButton
                        color="neutral"
                        variant="outline"
                        class="w-full justify-start"
                      >
                        <UIcon name="lucide:arrow-up-down" class="w-4 h-4 mr-2" />
                        {{ getSortLabel() }}
                      </UButton>

                      
                    </UDropdownMenu>
                    <template #fallback>
                      <USelect
                        placeholder="Carregando..."
                        disabled
                        class="w-full"
                      />
                    </template>
                 </ClientOnly>
               </div>
            </div>
          </UCard>
        </div>
      </div>

      
      <div class="flex-1 min-w-0">
        
        <div class="mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ClientOnly>
              <div class="flex items-center gap-4">
                <span class="text-sm text-slate-600 dark:text-slate-400">
                  {{ pagination.totalItems }} produtos encontrados
                </span>
                <UBadge
                  v-if="filters.search || filters.category !== 'all' || filters.minPrice || filters.maxPrice"
                  color="primary"
                  variant="soft"
                  size="sm"
                >
                  Filtros ativos
                </UBadge>
              </div>
              <template #fallback>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-slate-600 dark:text-slate-400">
                    Carregando produtos...
                  </span>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        
        <ClientOnly>
          <div v-if="loading && !hasProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton v-for="i in 12" :key="i" />
          </div>

          <ErrorState
            v-else-if="error && !hasProducts"
            :error="error"
            @retry="retryLoad"
          />

          <EmptyState
            v-else-if="!hasProducts && !loading"
            title="Nenhum produto encontrado"
            description="Não encontramos produtos que correspondam aos seus critérios de busca."
            icon="lucide:package-search"
            action-label="Adicionar Produto"
            action-to="/products/new"
          />

          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @delete="handleDeleteProduct"
              />
            </div>

                         
             <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
               <div class="text-sm text-slate-600 dark:text-slate-400">
                 Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
               </div>

               <div class="flex items-center gap-2">
                 <UButton
                   :disabled="pagination.currentPage === 1"
                   icon="lucide:chevron-left"
                   color="neutral"
                   variant="ghost"
                   size="sm"
                   @click="productsStore.goToPage(pagination.currentPage - 1)"
                 />
                 
                 <div class="flex items-center gap-1">
                   <UButton
                     v-for="pageNum in getVisiblePages()"
                     :key="pageNum"
                     :color="pageNum === pagination.currentPage ? 'primary' : 'neutral'"
                     :variant="pageNum === pagination.currentPage ? 'solid' : 'ghost'"
                     size="sm"
                     @click="productsStore.goToPage(pageNum)"
                   >
                     {{ pageNum }}
                   </UButton>
                 </div>
                 
                 <UButton
                   :disabled="pagination.currentPage === pagination.totalPages"
                   icon="lucide:chevron-right"
                   color="neutral"
                   variant="ghost"
                   size="sm"
                   @click="productsStore.goToPage(pagination.currentPage + 1)"
                 />
               </div>
             </div>
          </div>

          <template #fallback>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCardSkeleton v-for="i in 12" :key="i" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    
    <DeleteConfirmationModal
      :open="showDeleteModal"
      title="Remover produto"
      description="Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo."
      confirm-label="Remover"
      :loading="loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @update:open="(value) => showDeleteModal = value"
    />
  </div>
</template>
