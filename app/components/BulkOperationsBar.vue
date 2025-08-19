<script setup lang="ts">
import type { Product } from '~~/types/product'

interface Props {
  products: Product[]
}

const _props = defineProps<Props>()

const bulkStore = useBulkOperationsStore()
const { selectedCount, hasSelection, isSelectMode } = storeToRefs(bulkStore)

const showBulkUpdateModal = ref(false)
const showBulkDeleteModal = ref(false)
const bulkUpdateData = ref({
  category: '',
  featured: undefined as boolean | undefined,
  price: undefined as number | undefined
})

const categoryOptions = [
  { label: $t('categories.electronics'), value: 'Eletrônicos' },
  { label: $t('categories.clothing'), value: 'Roupas' },
  { label: $t('categories.home'), value: 'Casa e Jardim' },
  { label: $t('categories.sports'), value: 'Esportes' },
  { label: $t('categories.books'), value: 'Livros' },
  { label: $t('categories.health'), value: 'Saúde e Beleza' },
  { label: $t('categories.toys'), value: 'Brinquedos' },
  { label: $t('categories.automotive'), value: 'Automóveis' }
]

const handleBulkUpdate = async () => {
  const updates: Partial<Product> = {}
  
  if (bulkUpdateData.value.category) {
    updates.category = bulkUpdateData.value.category
  }
  if (bulkUpdateData.value.featured !== undefined) {
    updates.featured = bulkUpdateData.value.featured
  }
  if (bulkUpdateData.value.price !== undefined) {
    updates.price = bulkUpdateData.value.price
  }

  await bulkStore.bulkUpdate(updates)
  showBulkUpdateModal.value = false
  bulkUpdateData.value = { category: '', featured: undefined, price: undefined }
}

const handleBulkDelete = async () => {
  await bulkStore.bulkDelete()
  showBulkDeleteModal.value = false
}

const handleBulkExport = (format: 'csv' | 'json') => {
  bulkStore.bulkExport(format)
}

const _resetBulkUpdateData = () => {
  bulkUpdateData.value = { category: '', featured: undefined, price: undefined }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showBulkUpdateModal.value = false
    showBulkDeleteModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div v-if="isSelectMode" class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
    <div class="container mx-auto px-4 lg:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="lucide:check-square" class="w-5 h-5 text-primary-600" />
            <span class="font-medium text-slate-900 dark:text-white">
              {{ $t('bulkOperations.selected', { count: selectedCount }) }}
            </span>
          </div>
          
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="bulkStore.clearSelection"
          >
            {{ $t('bulkOperations.clear') }}
          </UButton>
        </div>

        <div class="flex items-center gap-2">
          <UDropdownMenu
            :items="[
              {
                label: $t('bulkOperations.export.csv'),
                icon: 'lucide:file-text',
                click: () => handleBulkExport('csv')
              },
              {
                label: $t('bulkOperations.export.json'),
                icon: 'lucide:file-code',
                click: () => handleBulkExport('json')
              }
            ]"
          >
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="lucide:download"
              :disabled="!hasSelection"
            >
              {{ $t('bulkOperations.export.title') }}
            </UButton>
          </UDropdownMenu>

          <UButton
            color="primary"
            variant="outline"
            size="sm"
            icon="lucide:edit-3"
            :disabled="!hasSelection"
            @click="showBulkUpdateModal = true"
          >
            {{ $t('bulkOperations.update.title') }}
          </UButton>

          <UButton
            color="error"
            variant="outline"
            size="sm"
            icon="lucide:trash-2"
            :disabled="!hasSelection"
            @click="showBulkDeleteModal = true"
          >
            {{ $t('bulkOperations.delete.title') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <ClientOnly>
      <div v-if="showBulkUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="showBulkUpdateModal = false" />
        <UCard class="relative w-full max-w-md z-10">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:edit-3" class="w-5 h-5 text-primary-600" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ $t('bulkOperations.update.modal.title') }}
              </h3>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              {{ $t('bulkOperations.update.modal.description', { count: selectedCount }) }}
            </p>

            <UFormField
              :label="$t('products.form.category')"
              name="category"
            >
              <USelect
                v-model="bulkUpdateData.category"
                :items="categoryOptions"
                :placeholder="$t('bulkOperations.update.modal.categoryPlaceholder')"
                clearable
              />
            </UFormField>

            <UFormField
              :label="$t('products.form.price')"
              name="price"
            >
              <UInput
                v-model="bulkUpdateData.price"
                type="number"
                step="0.01"
                min="0"
                :placeholder="$t('bulkOperations.update.modal.pricePlaceholder')"
                clearable
              />
            </UFormField>

            <UFormField
              :label="$t('products.form.featured')"
              name="featured"
            >
              <USelect
                v-model="bulkUpdateData.featured"
                :items="[
                  { label: $t('common.yes'), value: true },
                  { label: $t('common.no'), value: false }
                ]"
                :placeholder="$t('bulkOperations.update.modal.featuredPlaceholder')"
                clearable
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="showBulkUpdateModal = false"
              >
                {{ $t('common.cancel') }}
              </UButton>
              <UButton
                color="primary"
                @click="handleBulkUpdate"
              >
                {{ $t('bulkOperations.update.modal.confirm') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="showBulkDeleteModal = false" />
        <UCard class="relative w-full max-w-md z-10">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:trash-2" class="w-5 h-5 text-error-600" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ $t('bulkOperations.delete.modal.title') }}
              </h3>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              {{ $t('bulkOperations.delete.modal.description', { count: selectedCount }) }}
            </p>
            <p class="text-sm text-error-600 dark:text-error-400 font-medium">
              {{ $t('bulkOperations.delete.modal.warning') }}
            </p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="showBulkDeleteModal = false"
              >
                {{ $t('common.cancel') }}
              </UButton>
              <UButton
                color="error"
                @click="handleBulkDelete"
              >
                {{ $t('bulkOperations.delete.modal.confirm') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </ClientOnly>
  </Teleport>
</template>
