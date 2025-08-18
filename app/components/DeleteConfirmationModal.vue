<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

interface Emits {
  'update:open': [value: boolean]
  'confirm': []
  'cancel': []
}

const { open, title = 'Confirmar exclusão', description = 'Esta ação não pode ser desfeita. Tem certeza que deseja continuar?', confirmLabel = 'Excluir', cancelLabel = 'Cancelar', loading = false } = defineProps<Props>()

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="!loading && handleCancel()"
    >
      <div class="fixed inset-0 bg-black/50" />
      
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <UIcon 
              name="lucide:alert-triangle" 
              class="w-5 h-5 text-red-600 dark:text-red-400" 
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {{ description }}
        </p>

        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="loading"
            @click="handleCancel"
          >
            {{ cancelLabel }}
          </UButton>
          
          <UButton
            color="error"
            variant="solid"
            :loading="loading"
            :disabled="loading"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </UButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>