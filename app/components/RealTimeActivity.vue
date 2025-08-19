<script setup lang="ts">
const realTime = useRealTime()
const { events, isConnected } = storeToRefs(realTime)

const showActivityPanel = ref(false)
const maxEvents = 10

const visibleEvents = computed(() => 
  events.value.slice(0, maxEvents)
)

const toggleActivityPanel = () => {
  showActivityPanel.value = !showActivityPanel.value
}

const clearActivity = () => {
  realTime.clearEvents()
}

const getEventTitle = (event: RealTimeEvent) => {
  switch (event.type) {
    case 'product_created':
      return $t('realtime.product.created.title')
    case 'product_updated':
      return $t('realtime.product.updated.title')
    case 'product_deleted':
      return $t('realtime.product.deleted.title')
    case 'bulk_operation':
      return $t('realtime.bulk.title')
    default:
      return $t('realtime.event.unknown')
  }
}

const getEventDescription = (event: RealTimeEvent) => {
  switch (event.type) {
    case 'product_created':
      return $t('realtime.product.created.description', { name: event.data.name })
    case 'product_updated':
      return $t('realtime.product.updated.description', { name: event.data.name })
    case 'product_deleted':
      return $t('realtime.product.deleted.description', { name: event.data.name })
    case 'bulk_operation':
      return $t('realtime.bulk.description', { 
        type: event.data.type, 
        count: event.data.items.length 
      })
    default:
      return $t('realtime.event.unknown')
  }
}
</script>

<template>
  <div class="relative">
    <UButton
      icon="lucide:activity"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="$t('realtime.activity.title')"
      class="relative"
      @click="toggleActivityPanel"
    >
      <div 
        v-if="events.length > 0" 
        class="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"
      />
    </UButton>

    <div 
      v-if="showActivityPanel"
      class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50"
    >
      <div class="p-4 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="lucide:activity" class="w-4 h-4 text-primary-600" />
            <h3 class="font-semibold text-slate-900 dark:text-white">
              {{ $t('realtime.activity.title') }}
            </h3>
          </div>
          
          <div class="flex items-center gap-2">
            <UBadge
              :color="isConnected ? 'success' : 'error'"
              variant="soft"
              size="sm"
            >
              <UIcon 
                :name="isConnected ? 'lucide:wifi' : 'lucide:wifi-off'" 
                class="w-3 h-3 mr-1" 
              />
              {{ isConnected ? $t('realtime.status.online') : $t('realtime.status.offline') }}
            </UBadge>
            
            <UButton
              icon="lucide:trash-2"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="clearActivity"
            />
          </div>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="events.length === 0" class="p-6 text-center">
          <UIcon name="lucide:activity" class="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ $t('realtime.activity.empty') }}
          </p>
        </div>

        <div v-else class="divide-y divide-slate-200 dark:divide-slate-700">
          <div
            v-for="event in visibleEvents"
            :key="`${event.type}-${event.timestamp.getTime()}`"
            class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="{
                    'bg-success-100 text-success-600 dark:bg-success-900/20 dark:text-success-400': realTime.getEventColor(event.type) === 'success',
                    'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400': realTime.getEventColor(event.type) === 'primary',
                    'bg-error-100 text-error-600 dark:bg-error-900/20 dark:text-error-400': realTime.getEventColor(event.type) === 'error',
                    'bg-info-100 text-info-600 dark:bg-info-900/20 dark:text-info-400': realTime.getEventColor(event.type) === 'info'
                  }"
                >
                  <UIcon :name="realTime.getEventIcon(event.type)" class="w-4 h-4" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ getEventTitle(event) }}
                </h4>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {{ getEventDescription(event) }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {{ realTime.formatTimestamp(event.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="events.length > maxEvents" class="p-4 border-t border-slate-200 dark:border-slate-700">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="w-full"
            @click="clearActivity"
          >
            {{ $t('realtime.activity.clear') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
