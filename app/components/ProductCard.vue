<script setup lang="ts">
import type { Product } from '~~/types/product'

interface Props {
  product: Product
  loading?: boolean
}

interface Emits {
  'delete': [productId: string]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const handleDelete = () => {
  emit('delete', props.product.id)
}

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.product.price)
})

const stockStatus = computed(() => {
  if (props.product.stock === 0) return 'Esgotado'
  if (props.product.stock <= 5) return 'Estoque baixo'
  return 'Em estoque'
})

const stockColor = computed(() => {
  if (props.product.stock === 0) return 'error'
  if (props.product.stock <= 5) return 'warning'
  return 'success'
})

const stockIcon = computed(() => {
  if (props.product.stock === 0) return 'lucide:x-circle'
  if (props.product.stock <= 5) return 'lucide:alert-triangle'
  return 'lucide:check-circle'
})
</script>

<template>
  <UCard class="group hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
    
    <div class="relative aspect-[4/3] overflow-hidden">
      <NuxtImg
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        placeholder="/placeholder-product.svg"
        format="webp"
      />
      
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
      
      
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <UBadge
          v-if="product.featured"
          color="primary"
          variant="solid"
          size="sm"
          class="shadow-lg"
        >
          <UIcon name="lucide:star" class="w-3 h-3 mr-1" />
          Destaque
        </UBadge>
      </div>
      
      <div class="absolute top-3 right-3">
        <UBadge
          :color="stockColor"
          variant="solid"
          size="sm"
          class="shadow-lg"
        >
          <UIcon :name="stockIcon" class="w-3 h-3 mr-1" />
          {{ stockStatus }}
        </UBadge>
      </div>
    </div>

    
    <div class="flex-1 flex flex-col p-6">
      
      <div class="mb-3">
        <UBadge
          color="neutral"
          variant="soft"
          size="sm"
        >
          {{ product.category }}
        </UBadge>
      </div>

      
      <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ product.name }}
      </h3>
      
      
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
        {{ product.description }}
      </p>
      
      
      <div class="flex items-center justify-between mb-4 text-sm text-slate-500 dark:text-slate-400">
        <div class="flex items-center gap-1">
          <UIcon name="lucide:star" class="w-4 h-4 text-yellow-500 fill-current" />
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="lucide:package" class="w-4 h-4" />
          <span>{{ product.stock }} unidades</span>
        </div>
      </div>
      
      
      <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div>
          <span class="text-2xl font-bold text-slate-900 dark:text-white">
            {{ formattedPrice }}
          </span>
        </div>
        
        <div class="flex items-center gap-1">
          <UButton
            :to="`/products/${product.id}`"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="lucide:eye"
            aria-label="Ver detalhes"
            class="hover:bg-slate-100 dark:hover:bg-slate-800"
          />
          <UButton
            :to="`/products/${product.id}/edit`"
            color="primary"
            variant="ghost"
            size="sm"
            icon="lucide:edit-3"
            aria-label="Editar produto"
            class="hover:bg-primary-50 dark:hover:bg-primary-900/20"
          />
          <UButton
            color="error"
            variant="ghost"
            size="sm"
            icon="lucide:trash-2"
            aria-label="Remover produto"
            class="hover:bg-red-50 dark:hover:bg-red-900/20"
            @click="handleDelete"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>