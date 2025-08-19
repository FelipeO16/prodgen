<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Dashboard'
})

useSeoMeta({
  title: `${$t('dashboard.title')} - ProdGen`,
  description: $t('dashboard.subtitle'),
  robots: 'noindex'
})

const productsStore = useProductsStore()
const { products, loading, pagination, categories } = storeToRefs(productsStore)

await productsStore.fetchProducts()
await productsStore.fetchCategories()

const stats = computed(() => ({
  totalProducts: pagination.value.totalItems,
  totalCategories: categories.value.length,
  featuredProducts: products.value.filter(p => p.featured).length,
  lowStock: products.value.filter(p => p.stock < 10).length
}))

const recentProducts = computed(() => 
  products.value.slice(0, 5)
)
</script>

<template>
  <div class="container mx-auto px-4 lg:px-6 py-8">
    
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            {{ $t('dashboard.title') }}
          </h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            {{ $t('dashboard.subtitle') }}
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <UButton
            to="/products/new"
            icon="lucide:plus"
            color="primary"
            variant="solid"
          >
            {{ $t('dashboard.addProduct') }}
          </UButton>
        </div>
      </div>
    </div>

    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <UIcon name="lucide:package" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ $t('dashboard.stats.totalProducts') }}</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <UIcon name="lucide:tag" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ $t('dashboard.stats.categories') }}</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.totalCategories }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <UIcon name="lucide:star" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ $t('dashboard.stats.featured') }}</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.featuredProducts }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <UIcon name="lucide:alert-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ $t('dashboard.stats.lowStock') }}</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.lowStock }}</p>
          </div>
        </div>
      </UCard>
    </div>

    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ $t('dashboard.recentProducts.title') }}
              </h3>
              <UButton
                to="/products"
                variant="ghost"
                color="primary"
                size="sm"
              >
                {{ $t('dashboard.recentProducts.viewAll') }}
              </UButton>
            </div>
          </template>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4">
              <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"/>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"/>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"/>
              </div>
            </div>
          </div>

          <div v-else-if="recentProducts.length === 0" class="text-center py-8">
            <UIcon name="lucide:package-x" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p class="text-slate-600 dark:text-slate-400">{{ $t('products.empty.title') }}</p>
            <UButton
              to="/products/new"
              color="primary"
              variant="ghost"
              class="mt-4"
            >
              {{ $t('products.empty.action') }}
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="product in recentProducts"
              :key="product.id"
              class="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <NuxtImg
                :src="product.image"
                :alt="product.name"
                class="w-16 h-16 object-cover rounded-lg"
                loading="lazy"
                format="webp"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-slate-900 dark:text-white truncate">
                  {{ product.name }}
                </h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  {{ product.category }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-lg font-bold text-slate-900 dark:text-white">
                    R$ {{ product.price.toFixed(2) }}
                  </span>
                                     <UBadge
                     :color="product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                     variant="soft"
                     size="sm"
                   >
                    {{ product.stock }} {{ $t('products.card.stock') }}
                  </UBadge>
                </div>
              </div>
              <UButton
                :to="`/products/${product.id}`"
                icon="lucide:eye"
                color="neutral"
                variant="ghost"
                size="sm"
                :aria-label="$t('products.card.view')"
              />
            </div>
          </div>
        </UCard>
      </div>

      
      <div>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ $t('dashboard.quickActions.title') }}
            </h3>
          </template>

          <div class="space-y-3">
            <UButton
              to="/products/new"
              icon="lucide:plus"
              color="primary"
              variant="solid"
              class="w-full justify-start"
            >
              {{ $t('dashboard.quickActions.addProduct') }}
            </UButton>
            
            <UButton
              to="/products"
              icon="lucide:list"
              color="neutral"
              variant="ghost"
              class="w-full justify-start"
            >
              {{ $t('dashboard.quickActions.viewAllProducts') }}
            </UButton>
            
            <UButton
              icon="lucide:download"
              color="neutral"
              variant="ghost"
              class="w-full justify-start"
            >
              {{ $t('dashboard.quickActions.exportReport') }}
            </UButton>
            
            <UButton
              icon="lucide:settings"
              color="neutral"
              variant="ghost"
              class="w-full justify-start"
            >
              {{ $t('dashboard.quickActions.settings') }}
            </UButton>
          </div>
        </UCard>

        
        <UCard class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ $t('dashboard.categories.title') }}
            </h3>
          </template>

          <div v-if="categories.length === 0" class="text-center py-4">
            <p class="text-slate-600 dark:text-slate-400 text-sm">{{ $t('common.noData') }}</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="category in categories.slice(0, 5)"
              :key="category"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ category }}</span>
                             <UBadge
                 :color="products.filter(p => p.category === category).length > 5 ? 'success' : 'neutral'"
                 variant="soft"
                 size="sm"
               >
                {{ products.filter(p => p.category === category).length }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
