export function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const flush = (...args: Parameters<T>) => {
    cancel()
    fn(...args)
  }

  return {
    debounced,
    cancel,
    flush
  }
}