export function useLazyLoad() {
  const loadedImages = new Set<string>()

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        loadedImages.add(src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  const preloadImages = async (sources: string[]) => {
    const promises = sources.map(src => preloadImage(src).catch(() => {}))
    await Promise.allSettled(promises)
  }

  const isImageLoaded = (src: string) => loadedImages.has(src)

  return {
    preloadImage,
    preloadImages,
    isImageLoaded,
    loadedImages: readonly(loadedImages)
  }
}
