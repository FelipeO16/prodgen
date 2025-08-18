<script setup lang="ts">
interface Props {
  sortBy: string
  sortOrder: string
}

interface Emits {
  'update': [sortBy: string, sortOrder: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const sortOptions = [
  { label: 'Nome (A-Z)', value: 'name-asc', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Nome (Z-A)', value: 'name-desc', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Preço (Menor)', value: 'price-asc', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Preço (Maior)', value: 'price-desc', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Avaliação', value: 'rating-desc', sortBy: 'rating', sortOrder: 'desc' },
  { label: 'Mais Recente', value: 'createdAt-desc', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Mais Antigo', value: 'createdAt-asc', sortBy: 'createdAt', sortOrder: 'asc' }
]

const currentValue = computed(() => {
  return `${props.sortBy}-${props.sortOrder}`
})

const selectedOption = computed(() => {
  return sortOptions.find(option => option.value === currentValue.value)
})

const handleSelect = (option: { sortBy: string; sortOrder: string }) => {
  emit('update', option.sortBy, option.sortOrder)
}
</script>

<template>
  <UDropdownMenu
    :items="sortOptions"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      class="w-full justify-start"
    >
      <UIcon name="lucide:arrow-up-down" class="w-4 h-4 mr-2" />
      {{ selectedOption?.label || 'Ordenar por...' }}
    </UButton>

    <template #item="{ item }">
      <div
        class="flex items-center px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </div>
    </template>
  </UDropdownMenu>
</template>