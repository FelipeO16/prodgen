export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  let observer: IntersectionObserver | null = null

  const isSupported = ref(false)

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const start = () => {
    if (!import.meta.client) return

    isSupported.value = 'IntersectionObserver' in window

    if (!isSupported.value) return

    stop()

    if (target.value) {
      observer = new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      })
      observer.observe(target.value)
    }
  }

  watchEffect(() => {
    if (target.value) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isSupported,
    stop,
    start
  }
}
