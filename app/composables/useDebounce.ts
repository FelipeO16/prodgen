export function useDebounce(fn: Function, delay: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const flush = (...args: any[]) => {
    cancel()
    fn.apply(null, args)
  }

  return {
    debounced,
    cancel,
    flush
  }
}