<script setup lang="ts">
interface Option {
  label: string
  value: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
  label?: string
  loading?: boolean
}

interface Emits {
  'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione...',
  loading: false
})

const emit = defineEmits<Emits>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const _selectedOption = computed(() => {
  return props.options.find(option => option.value === selectedValue.value)
})
</script>

<template>
  <div class="w-full">
    <USelectMenu
      v-model="selectedValue"
      :options="options"
      :placeholder="placeholder"
      :loading="loading"
      value-attribute="value"
      option-attribute="label"
      class="w-full"
    />
  </div>
</template>