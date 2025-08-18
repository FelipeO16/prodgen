<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  error?: string
  retryLabel?: string
}

interface Emits {
  'retry': []
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Ops! Algo deu errado',
  description: 'Ocorreu um erro inesperado. Tente novamente.',
  retryLabel: 'Tentar novamente'
})

const emit = defineEmits<Emits>()

const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
      <UIcon 
        name="lucide:alert-circle" 
        class="w-8 h-8 text-red-500 dark:text-red-400" 
      />
    </div>
    
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-600 dark:text-gray-400 mb-2 max-w-md">
      {{ description }}
    </p>
    
    <p 
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400 mb-6 max-w-md font-mono bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md"
    >
      {{ error }}
    </p>
    
    <UButton
      color="primary"
      variant="solid"
      icon="lucide:refresh-cw"
      @click="handleRetry"
    >
      {{ retryLabel }}
    </UButton>
  </div>
</template>