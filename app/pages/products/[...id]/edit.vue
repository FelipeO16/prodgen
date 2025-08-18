<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { UpdateProductData } from '~~/types/product'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

definePageMeta({
  title: 'Editar Produto'
})

const productsStore = useProductsStore()
const { currentProduct, loading, error } = storeToRefs(productsStore)

const handleSubmit = async (data: UpdateProductData) => {
  try {
    await productsStore.updateProduct(data)
    
    const toast = useToast()
    toast.add({
      title: 'Produto atualizado com sucesso!',
      description: 'As alterações foram salvas.',
      color: 'success'
    })
    
    router.push(`/products/${productId}`)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Erro ao atualizar produto',
      description: error instanceof Error ? error.message : 'Erro inesperado',
      color: 'error'
    })
  }
}

const handleCancel = () => {
  router.push(`/products/${productId}`)
}

const retryLoad = () => {
  productsStore.fetchProduct(productId)
}

useSeoMeta({
  title: () => currentProduct.value ? `Editar ${currentProduct.value.name}` : 'Editar Produto',
  description: 'Edite as informações do produto.',
  robots: 'noindex'
})

onMounted(async () => {
  if (!currentProduct.value || currentProduct.value.id !== productId) {
    await productsStore.fetchProduct(productId)
  }
})

onUnmounted(() => {
  productsStore.clearCurrentProduct()
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-6 py-8">
    
    <div class="mb-8">
      <UBreadcrumb
        :items="[
          { label: 'Dashboard', to: '/', icon: 'lucide:home' },
          { label: 'Produtos', to: '/products', icon: 'lucide:package' },
          { label: currentProduct?.name || 'Produto', to: `/products/${productId}` },
          { label: 'Editar', to: '#', icon: 'lucide:edit-3' }
        ]"
      />
    </div>

    <div class="max-w-4xl mx-auto">
      
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <UIcon name="lucide:edit-3" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              Editar Produto
            </h1>
            <p class="mt-2 text-slate-600 dark:text-slate-400">
              Atualize as informações do produto
            </p>
          </div>
        </div>
      </div>
      <div v-if="loading && !currentProduct" class="animate-pulse">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <USkeleton class="h-6 w-48 mb-6" />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-6">
              <USkeleton class="h-10 w-full" />
              <USkeleton class="h-24 w-full" />
              <div class="grid grid-cols-2 gap-4">
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-10 w-full" />
              </div>
              <USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-6">
              <USkeleton class="h-10 w-full" />
              <USkeleton class="h-48 w-full" />
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

      <div v-else-if="currentProduct">
        <ProductForm
          :product="currentProduct"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
