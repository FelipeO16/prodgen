<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  loading?: boolean
  debounceMs?: number
}

interface Emits {
  'update:modelValue': [value: string]
  'search': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar produtos...',
  loading: false,
  debounceMs: 500
})

const emit = defineEmits<Emits>()

const { debounced } = useDebounce(
  () => emit('search', props.modelValue),
  props.debounceMs
)

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
    debounced()
  }
})

const searchInputRef = ref<HTMLInputElement>()

const clearSearch = () => {
  searchValue.value = ''
}

const focusInput = () => {
  searchInputRef.value?.focus()
}

defineShortcuts({
  meta_k: {
    usingInput: false,
    handler: focusInput
  },
  ctrl_k: {
    usingInput: false,
    handler: focusInput
  },
  escape: {
    usingInput: true,
    handler: clearSearch
  }
})
</script>

<template>
  <div class="relative">
    <UInput
      ref="searchInputRef"
      v-model="searchValue"
      :placeholder="placeholder"
      :loading="loading"
      icon="lucide:search"
      size="lg"
      class="w-full"
      :ui="{
        icon: {
          trailing: {
            pointer: ''
          }
        }
      }"
    >
      <template #trailing>
        <div class="flex items-center gap-1">
          <UButton
            v-if="searchValue"
            color="neutral"
            variant="ghost"
            size="xs"
            icon="lucide:x"
            aria-label="Limpar busca"
            @click="clearSearch"
          />
        </div>
      </template>
    </UInput>
  </div>
</template>