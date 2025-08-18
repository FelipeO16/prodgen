<script setup lang="ts">
interface Props {
  minPrice: number | null
  maxPrice: number | null
}

interface Emits {
  'update:minPrice': [value: number | null]
  'update:maxPrice': [value: number | null]
  'apply': [minPrice: number | null, maxPrice: number | null]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localMinPrice = ref(props.minPrice?.toString() || '')
const localMaxPrice = ref(props.maxPrice?.toString() || '')

const minPriceValue = computed({
  get: () => localMinPrice.value,
  set: (value: string) => {
    localMinPrice.value = value
    const numValue = value ? Number(value) : null
    emit('update:minPrice', numValue)
  }
})

const maxPriceValue = computed({
  get: () => localMaxPrice.value,
  set: (value: string) => {
    localMaxPrice.value = value
    const numValue = value ? Number(value) : null
    emit('update:maxPrice', numValue)
  }
})

const isValid = computed(() => {
  const min = localMinPrice.value ? Number(localMinPrice.value) : null
  const max = localMaxPrice.value ? Number(localMaxPrice.value) : null
  
  if (min !== null && min < 0) return false
  if (max !== null && max < 0) return false
  if (min !== null && max !== null && min > max) return false
  
  return true
})

const applyFilter = () => {
  if (isValid.value) {
    const min = localMinPrice.value ? Number(localMinPrice.value) : null
    const max = localMaxPrice.value ? Number(localMaxPrice.value) : null
    emit('apply', min, max)
  }
}

const clearFilter = () => {
  localMinPrice.value = ''
  localMaxPrice.value = ''
  emit('apply', null, null)
}

watch([() => props.minPrice, () => props.maxPrice], ([min, max]) => {
  localMinPrice.value = min?.toString() || ''
  localMaxPrice.value = max?.toString() || ''
})
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-2">
      <UInput
        v-model="minPriceValue"
        type="number"
        placeholder="Min"
        min="0"
        step="0.01"
        :ui="{
          wrapper: 'relative'
        }"
      >
        <template #leading>
          <span class="text-gray-500 dark:text-gray-400 text-xs">R$</span>
        </template>
      </UInput>
      
      <UInput
        v-model="maxPriceValue"
        type="number"
        placeholder="Max"
        min="0"
        step="0.01"
        :ui="{
          wrapper: 'relative'
        }"
      >
        <template #leading>
          <span class="text-gray-500 dark:text-gray-400 text-xs">R$</span>
        </template>
      </UInput>
    </div>
    
    <div class="flex gap-2">
      <UButton
        size="xs"
        color="primary"
        variant="soft"
        :disabled="!isValid"
        @click="applyFilter"
      >
        Aplicar
      </UButton>
      
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        @click="clearFilter"
      >
        Limpar
      </UButton>
    </div>
    
    <div
      v-if="!isValid"
      class="text-xs text-red-500"
    >
      Verifique os valores inseridos
    </div>
  </div>
</template>