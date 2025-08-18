<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { CreateProductData, UpdateProductData } from '~~/types/product'

definePageMeta({
  title: 'Novo Produto'
})

useSeoMeta({
  title: 'Adicionar Novo Produto - ProdGen',
  description: 'Adicione um novo produto ao catálogo com informações completas.',
  robots: 'noindex'
})

const router = useRouter()
const productsStore = useProductsStore()
const { loading } = storeToRefs(productsStore)

const handleSubmit = async (data: CreateProductData | UpdateProductData) => {
  try {
    const newProduct = await productsStore.createProduct(data as CreateProductData)
    
    const toast = useToast()
    toast.add({
      title: 'Produto criado com sucesso!',
      description: 'O produto foi adicionado ao catálogo.',
      color: 'success'
    })
    
    router.push(`/products/${newProduct.id}`)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Erro ao criar produto',
      description: error instanceof Error ? error.message : 'Erro inesperado',
      color: 'error'
    })
  }
}

const handleCancel = () => {
  router.push('/products')
}
</script>

<template>
  <div class="container mx-auto px-4 lg:px-6 py-8">
    
    <div class="mb-8">
      <UBreadcrumb
        :items="[
          { label: 'Dashboard', to: '/', icon: 'lucide:home' },
          { label: 'Produtos', to: '/products', icon: 'lucide:package' },
          { label: 'Novo Produto', to: '#', icon: 'lucide:plus' }
        ]"
      />
    </div>

    <div class="max-w-4xl mx-auto">
      
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <UIcon name="lucide:plus-circle" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
              Adicionar Novo Produto
            </h1>
            <p class="mt-2 text-slate-600 dark:text-slate-400">
              Preencha as informações abaixo para adicionar um novo produto ao catálogo
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2">
          <ProductForm
            :loading="loading"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:info" class="w-5 h-5 text-blue-600" />
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    Dicas
                  </h3>
                </div>
              </template>
              
              <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div class="flex items-start gap-3">
                  <UIcon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Use imagens de alta qualidade para melhor apresentação</p>
                </div>
                <div class="flex items-start gap-3">
                  <UIcon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Descreva detalhadamente as características do produto</p>
                </div>
                <div class="flex items-start gap-3">
                  <UIcon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Mantenha o estoque atualizado para evitar problemas</p>
                </div>
                <div class="flex items-start gap-3">
                  <UIcon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Produtos em destaque aparecem na página inicial</p>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:bar-chart-3" class="w-5 h-5 text-purple-600" />
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    Estatísticas
                  </h3>
                </div>
              </template>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Total de produtos</span>
                  <span class="font-semibold text-slate-900 dark:text-white">
                    {{ productsStore.products.length }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Categorias</span>
                  <span class="font-semibold text-slate-900 dark:text-white">
                    {{ productsStore.categories.length }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Em destaque</span>
                  <span class="font-semibold text-slate-900 dark:text-white">
                    {{ productsStore.products.filter(p => p.featured).length }}
                  </span>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="lucide:zap" class="w-5 h-5 text-yellow-600" />
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    Ações Rápidas
                  </h3>
                </div>
              </template>
              
              <div class="space-y-3">
                <UButton
                  to="/products"
                  color="neutral"
                  variant="ghost"
                  class="w-full justify-start"
                  icon="lucide:list"
                >
                  Ver todos os produtos
                </UButton>
                <UButton
                  to="/"
                  color="neutral"
                  variant="ghost"
                  class="w-full justify-start"
                  icon="lucide:home"
                >
                  Voltar ao dashboard
                </UButton>
              </div>
            </UCard>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
