<script setup lang="ts">
const { $pwa } = useNuxtApp()

const showInstallPrompt = computed(() => $pwa?.showInstallPrompt)
const showUpdatePrompt = computed(() => $pwa?.needRefresh)
const showOfflineReady = computed(() => $pwa?.offlineReady)

const install = () => {
  $pwa?.install()
}

const update = () => {
  window.location.reload()
}

const close = () => {
  $pwa?.cancelInstall()
}
</script>

<template>
  <div v-if="showInstallPrompt || showUpdatePrompt || showOfflineReady" class="fixed top-4 right-4 z-50">
    <UCard class="w-80 shadow-xl border-2">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <UIcon 
            v-if="showInstallPrompt" 
            name="lucide:download" 
            class="w-6 h-6 text-primary-600" 
          />
          <UIcon 
            v-else-if="showUpdatePrompt" 
            name="lucide:refresh-cw" 
            class="w-6 h-6 text-orange-600" 
          />
          <UIcon 
            v-else-if="showOfflineReady" 
            name="lucide:wifi-off" 
            class="w-6 h-6 text-green-600" 
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-1">
            <span v-if="showInstallPrompt">{{ $t('pwa.install.title') }}</span>
            <span v-else-if="showUpdatePrompt">{{ $t('pwa.update.title') }}</span>
            <span v-else-if="showOfflineReady">{{ $t('pwa.offline.title') }}</span>
          </h3>
          
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
            <span v-if="showInstallPrompt">{{ $t('pwa.install.description') }}</span>
            <span v-else-if="showUpdatePrompt">{{ $t('pwa.update.description') }}</span>
            <span v-else-if="showOfflineReady">{{ $t('pwa.offline.description') }}</span>
          </p>
          
          <div class="flex gap-2">
            <UButton
              v-if="showInstallPrompt"
              size="sm"
              color="primary"
              @click="install"
            >
              {{ $t('pwa.install.button') }}
            </UButton>
            
            <UButton
              v-else-if="showUpdatePrompt"
              size="sm"
              color="warning"
              @click="update"
            >
              {{ $t('pwa.update.button') }}
            </UButton>
            
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              @click="close"
            >
              {{ $t('common.close') }}
            </UButton>
          </div>
        </div>
        
        <UButton
          icon="lucide:x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="close"
        />
      </div>
    </UCard>
  </div>
</template>
