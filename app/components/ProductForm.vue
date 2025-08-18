<script setup lang="ts">
import type { Product, CreateProductData, UpdateProductData } from '~~/types/product'

interface Props {
  product?: Product | null
  loading?: boolean
}

interface Emits {
  'submit': [data: CreateProductData | UpdateProductData]
  'cancel': []
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  loading: false
})

const emit = defineEmits<Emits>()

const isEditMode = computed(() => !!props.product)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  category: 'Roupas',
  image: '',
  stock: 0,
  featured: false
})

const errors = ref<Record<string, string>>({})

const categoryOptions = [
  { label: 'Eletrônicos', value: 'Eletrônicos' },
  { label: 'Roupas', value: 'Roupas' },
  { label: 'Casa e Jardim', value: 'Casa e Jardim' },
  { label: 'Esportes', value: 'Esportes' },
  { label: 'Livros', value: 'Livros' },
  { label: 'Saúde e Beleza', value: 'Saúde e Beleza' },
  { label: 'Brinquedos', value: 'Brinquedos' },
  { label: 'Automóveis', value: 'Automóveis' }
]

const validateForm = () => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
  } else if (form.name.length < 3) {
    errors.value.name = 'Nome deve ter pelo menos 3 caracteres'
  }

  if (!form.description.trim()) {
    errors.value.description = 'Descrição é obrigatória'
  } else if (form.description.length < 10) {
    errors.value.description = 'Descrição deve ter pelo menos 10 caracteres'
  }

  if (!form.price || form.price <= 0) {
    errors.value.price = 'Preço deve ser maior que zero'
  }

  if (!form.category) {
    errors.value.category = 'Categoria é obrigatória'
  }

  if (!form.image.trim()) {
    errors.value.image = 'URL da imagem é obrigatória'
  } else {
    try {
      new URL(form.image)
    } catch {
      errors.value.image = 'URL da imagem inválida'
    }
  }

  if (form.stock < 0) {
    errors.value.stock = 'Estoque não pode ser negativo'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  const data = {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    category: form.category,
    image: form.image.trim(),
    stock: Number(form.stock),
    featured: form.featured
  }

  if (isEditMode.value && props.product) {
    emit('submit', { ...data, id: props.product.id } as UpdateProductData)
  } else {
    emit('submit', data as CreateProductData)
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  if (props.product) {
    form.name = props.product.name
    form.description = props.product.description
    form.price = props.product.price
    form.category = props.product.category
    form.image = props.product.image
    form.stock = props.product.stock
    form.featured = props.product.featured
  } else {
    form.name = ''
    form.description = ''
    form.price = 0
    form.category = 'Roupas'
    form.image = ''
    form.stock = 0
    form.featured = false
  }
  errors.value = {}
}

watch(() => props.product, resetForm, { immediate: true, deep: true })
</script>

<template>
  <UCard class="overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <UIcon 
              :name="isEditMode ? 'lucide:edit-3' : 'lucide:plus-circle'" 
              class="w-5 h-5 text-primary-600 dark:text-primary-400" 
            />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
              {{ isEditMode ? 'Editar Produto' : 'Informações do Produto' }}
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              {{ isEditMode ? 'Atualize as informações do produto' : 'Preencha todos os campos obrigatórios' }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <UForm
      :state="form"
      class="space-y-8"
      @submit="handleSubmit"
    >
      
      <div class="space-y-6">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="lucide:info" class="w-4 h-4 text-blue-600" />
          <h3 class="text-lg font-medium text-slate-900 dark:text-white">
            Informações Básicas
          </h3>
        </div>
        
        <UFormField
          label="Nome do produto"
          name="name"
          :error="errors.name"
          required
        >
          <UInput
            v-model="form.name"
            placeholder="Digite o nome do produto"
            :disabled="loading"
            icon="lucide:package"
            size="lg"
            class="font-medium"
          />
        </UFormField>

        <UFormField
          label="Descrição"
          name="description"
          :error="errors.description"
          required
        >
          <UTextarea
            v-model="form.description"
            placeholder="Descreva o produto detalhadamente, incluindo características, benefícios e especificações técnicas"
            :disabled="loading"
            :rows="4"
            size="lg"
            class="font-medium w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField
            label="Preço (R$)"
            name="price"
            :error="errors.price"
            required
          >
            <UInput
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              :disabled="loading"
              icon="lucide:dollar-sign"
              size="lg"
              class="font-medium"
            />
          </UFormField>

          <UFormField
            label="Estoque"
            name="stock"
            :error="errors.stock"
            required
          >
            <UInput
              v-model="form.stock"
              type="number"
              min="0"
              placeholder="0"
              :disabled="loading"
              icon="lucide:package-2"
              size="lg"
              class="font-medium"
            />
          </UFormField>
        </div>

        <UFormField
          label="Categoria"
          name="category"
          :error="errors.category"
          required
        >
          <USelect
            v-model="form.category"
            :items="categoryOptions"
            placeholder="Selecione uma categoria"
            :disabled="loading"
            size="lg"
            class="font-medium w-48"
          />
        </UFormField>
      </div>

      <div class="space-y-6">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="lucide:image" class="w-4 h-4 text-purple-600" />
          <h3 class="text-lg font-medium text-slate-900 dark:text-white">
            Imagem do Produto
          </h3>
        </div>
        
        <UFormField
          label="URL da imagem"
          name="image"
          :error="errors.image"
          required
        >
          <UInput
            v-model="form.image"
            placeholder="https://exemplo.com/imagem.jpg"
            :disabled="loading"
            icon="lucide:link"
            size="lg"
            class="font-medium"
          />
        </UFormField>

        <div v-if="form.image" class="space-y-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Pré-visualização
          </label>
          <div class="relative max-w-md">
            <NuxtImg
              :src="form.image"
              :alt="form.name || 'Pré-visualização'"
              class="w-full h-64 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              loading="lazy"
              format="webp"
              @error="errors.image = 'Erro ao carregar imagem'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"/>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="lucide:settings" class="w-4 h-4 text-orange-600" />
          <h3 class="text-lg font-medium text-slate-900 dark:text-white">
            Configurações
          </h3>
        </div>
        
        <UFormField
          label="Configurações do produto"
          name="featured"
        >
          <div class="space-y-3">
            <UCheckbox
              v-model="form.featured"
              label="Produto em destaque"
              :disabled="loading"
              class="font-medium"
            />
            <p class="text-sm text-slate-600 dark:text-slate-400 ml-6">
              Produtos em destaque aparecem na página inicial e recebem maior visibilidade
            </p>
          </div>
        </UFormField>
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          :disabled="loading"
          class="order-2 sm:order-1"
          @click="handleCancel"
        >
          <UIcon name="lucide:x" class="w-4 h-4 mr-2" />
          Cancelar
        </UButton>

        <UButton
          type="button"
          color="neutral"
          variant="soft"
          :disabled="loading"
          class="order-3 sm:order-2"
          @click="resetForm"
        >
          <UIcon name="lucide:rotate-ccw" class="w-4 h-4 mr-2" />
          Resetar
        </UButton>

        <UButton
          type="submit"
          color="primary"
          variant="solid"
          :loading="loading"
          :disabled="loading"
          class="order-1 sm:order-3"
        >
          <UIcon 
            :name="isEditMode ? 'lucide:save' : 'lucide:plus'" 
            class="w-4 h-4 mr-2" 
          />
          {{ isEditMode ? 'Atualizar Produto' : 'Criar Produto' }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>