import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const useDebounce = <T extends (...args: unknown[]) => void>(fn: T, delay = 300) => {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    return new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        fn(...args)
        resolve()
      }, delay)
    })
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const flush = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    fn(...args)
  }

  return {
    debounced,
    cancel,
    flush
  }
}

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce function calls', () => {
    const mockFn = vi.fn()
    const { debounced } = useDebounce(mockFn, 300)

    debounced('test')
    debounced('test2')
    debounced('test3')

    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test3')
  })

  it('should cancel debounced function', () => {
    const mockFn = vi.fn()
    const { debounced, cancel } = useDebounce(mockFn, 300)

    debounced('test')
    cancel()

    vi.advanceTimersByTime(300)

    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should flush debounced function immediately', () => {
    const mockFn = vi.fn()
    const { debounced, flush } = useDebounce(mockFn, 300)

    debounced('test')
    flush('immediate')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('immediate')

    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should use default delay of 300ms', () => {
    const mockFn = vi.fn()
    const { debounced } = useDebounce(mockFn)

    debounced('test')

    vi.advanceTimersByTime(299)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should handle multiple arguments', () => {
    const mockFn = vi.fn()
    const { debounced } = useDebounce(mockFn, 300)

    debounced('arg1', 'arg2', { key: 'value' })

    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' })
  })

  it('should handle async functions', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('result')
    const { debounced } = useDebounce(mockAsyncFn, 300)

    const promise = debounced('test')

    vi.advanceTimersByTime(300)

    await promise

    expect(mockAsyncFn).toHaveBeenCalledWith('test')
  })

  it('should handle function that returns values', () => {
    const mockFn = vi.fn().mockReturnValue('returned value')
    const { debounced } = useDebounce(mockFn, 300)

    debounced('test')

    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('test')
  })
})
