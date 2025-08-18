<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

definePageMeta({
  title: 'Detalhes do Produto'
})

const productsStore = useProductsStore()
const { currentProduct, loading, error } = storeToRefs(productsStore)

const showDeleteModal = ref(false)

const formattedPrice = computed(() => {
  if (!currentProduct.value) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(currentProduct.value.price)
})

const formattedDate = computed(() => {
  if (!currentProduct.value) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(currentProduct.value.createdAt))
})

const stockStatus = computed(() => {
  if (!currentProduct.value) return ''
  if (currentProduct.value.stock === 0) return 'Esgotado'
  if (currentProduct.value.stock <= 5) return 'Estoque baixo'
  return 'Em estoque'
})

const stockColor = computed(() => {
  if (!currentProduct.value) return 'neutral'
  if (currentProduct.value.stock === 0) return 'error'
  if (currentProduct.value.stock <= 5) return 'warning'
  return 'success'
})

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (currentProduct.value) {
    try {
      await productsStore.deleteProduct(currentProduct.value.id)
      const toast = useToast()
      toast.add({
        title: 'Produto removido',
        description: 'O produto foi removido com sucesso.',
        color: 'success'
      })
      router.push('/')
    } catch (error) {
      const toast = useToast()
      toast.add({
        title: 'Erro ao remover produto',
        description: error instanceof Error ? error.message : 'Erro inesperado',
        color: 'error'
      })
    } finally {
      showDeleteModal.value = false
    }
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const retryLoad = () => {
  productsStore.fetchProduct(productId)
}

useSeoMeta({
  title: () => currentProduct.value ? `${currentProduct.value.name} - Detalhes` : 'Produto',
  description: () => currentProduct.value?.description || 'Detalhes do produto',
  ogTitle: () => currentProduct.value?.name || 'Produto',
  ogDescription: () => currentProduct.value?.description || 'Detalhes do produto',
  ogImage: () => currentProduct.value?.image || ''
})

onMounted(() => {
  productsStore.fetchProduct(productId)
})

onUnmounted(() => {
  productsStore.clearCurrentProduct()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <UBreadcrumb
        :items="[
          { label: 'Dashboard', to: '/', icon: 'lucide:home' },
          { label: 'Produtos', to: '/products', icon: 'lucide:package' },
          { label: currentProduct?.name || 'Carregando...', to: '#' }
        ]"
      />
    </div>

    <div v-if="loading" class="animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <USkeleton class="w-full h-96 rounded-lg" />
        <div class="space-y-6">
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-6 w-1/2" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-4/5" />
          <div class="space-y-3">
            <USkeleton class="h-6 w-24" />
            <USkeleton class="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>

    <ErrorState
      v-else-if="error"
      title="Produto não encontrado"
      :description="error"
      @retry="retryLoad"
    />

    <div v-else-if="currentProduct" class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="relative">
            <NuxtImg
              :src="currentProduct.image"
              :alt="currentProduct.name"
              class="w-full h-96 object-cover rounded-lg shadow-lg"
              loading="eager"
              format="webp"
            />
            <UBadge
              v-if="currentProduct.featured"
              color="primary"
              variant="solid"
              class="absolute top-4 left-4"
            >
              Produto em Destaque
            </UBadge>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentProduct.name }}
            </h1>
            <div class="flex items-center gap-4 mb-4">
              <UBadge color="neutral" variant="soft" size="lg">
                {{ currentProduct.category }}
              </UBadge>
              <UBadge :color="stockColor" variant="subtle">
                {{ stockStatus }}
              </UBadge>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <UIcon
                name="lucide:star"
                class="w-5 h-5 text-yellow-400 fill-current"
              />
              <span class="text-lg font-medium text-gray-700 dark:text-gray-300 ml-2">
                {{ currentProduct.rating.toFixed(1) }}
              </span>
            </div>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ currentProduct.stock }} unidades em estoque
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ currentProduct.description }}
              </p>
            </div>

            <div class="border-t pt-4">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                {{ formattedPrice }}
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Data de criação:</span>
                  <div class="font-medium">{{ formattedDate }}</div>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">ID do produto:</span>
                  <div class="font-mono text-xs">{{ currentProduct.id }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6 border-t">
            <UButton
              :to="`/products/${currentProduct?.id}/edit`"
              color="primary"
              variant="solid"
              icon="lucide:edit"
              size="lg"
            >
              Editar Produto
            </UButton>

            <UButton
              color="error"
              variant="soft"
              icon="lucide:trash-2"
              size="lg"
              @click="handleDelete"
            >
              Remover
            </UButton>

            <UButton
              to="/products"
              color="neutral"
              variant="ghost"
              icon="lucide:arrow-left"
              size="lg"
            >
              Voltar
            </UButton>
          </div>
        </div>
      </div>

      <div class="border-t pt-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Especificações
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard>
            <div class="text-center">
              <UIcon name="lucide:package" class="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <h3 class="font-semibold mb-1">Estoque</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ currentProduct.stock }} unidades</p>
            </div>
          </UCard>

          <UCard>
            <div class="text-center">
              <UIcon name="lucide:star" class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 class="font-semibold mb-1">Avaliação</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ currentProduct.rating.toFixed(1) }} estrelas</p>
            </div>
          </UCard>

          <UCard>
            <div class="text-center">
              <UIcon name="lucide:tag" class="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 class="font-semibold mb-1">Categoria</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ currentProduct.category }}</p>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <DeleteConfirmationModal
      v-model:open="showDeleteModal"
      title="Remover produto"
      description="Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo."
      confirm-label="Remover"
      :loading="loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
