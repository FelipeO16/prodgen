export default defineNuxtPlugin(() => {
  const { $pwa } = useNuxtApp()
  
  if ($pwa) {
    $pwa.installPrompt = ref()
    $pwa.needRefresh = ref(false)
    $pwa.offlineReady = ref(false)
    
    const showInstallPrompt = () => {
      $pwa.installPrompt = ref()
    }
    
    const close = () => {
      $pwa.installPrompt = ref()
      $pwa.needRefresh = ref(false)
      $pwa.offlineReady = ref(false)
    }
    
    const install = () => {
      if ($pwa.installPrompt) {
        $pwa.installPrompt.prompt()
        $pwa.installPrompt = ref()
      }
    }
    
    const update = () => {
      $pwa.needRefresh = ref(false)
      window.location.reload()
    }
    
    return {
      provide: {
        pwa: {
          installPrompt: $pwa.installPrompt,
          needRefresh: $pwa.needRefresh,
          offlineReady: $pwa.offlineReady,
          showInstallPrompt,
          close,
          install,
          update
        }
      }
    }
  }
})
