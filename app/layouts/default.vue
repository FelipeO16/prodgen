<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const { locales, setLocale } = useI18n()

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

const navigation = [
  {
    label: $t('navigation.dashboard'),
    to: '/',
    icon: 'lucide:layout-dashboard',
    description: $t('dashboard.subtitle')
  },
  {
    label: $t('navigation.products'),
    to: '/products',
    icon: 'lucide:package',
    description: $t('products.title')
  },
]

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    
    <a href="#main-content" class="skip-link">
      {{ $t('accessibility.skipToContent') }}
    </a>

    
    <header class="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="flex items-center justify-between h-16">
          
          <div class="flex items-center gap-8">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <div class="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-lg">
                <UIcon name="lucide:shopping-bag" class="w-5 h-5" />
              </div>
              <span class="hidden sm:block">ProdGen</span>
            </NuxtLink>

            
            <nav class="hidden lg:flex items-center gap-1">
              <UButton
                v-for="item in navigation"
                :key="item.to"
                :to="item.to"
                :icon="item.icon"
                :color="isActiveRoute(item.to) ? 'primary' : 'neutral'"
                :variant="isActiveRoute(item.to) ? 'solid' : 'ghost'"
                class="justify-start px-4 py-2"
                :title="item.description"
              >
                <span class="hidden xl:block">{{ item.label }}</span>
              </UButton>
            </nav>
          </div>

          
          <div class="flex items-center gap-3">
            
            <UButton
              icon="lucide:bell"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="$t('notifications.title')"
              class="relative"
            >
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"/>
            </UButton>

            
            <ClientOnly>
              <UButton
                :icon="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'"
                color="neutral"
                variant="ghost"
                size="sm"
                :aria-label="$t('accessibility.themeToggle')"
                @click="toggleColorMode"
              />
              <template #fallback>
                <UButton
                  icon="lucide:moon"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :aria-label="$t('accessibility.themeToggle')"
                />
              </template>
            </ClientOnly>

            <div class="flex items-center gap-2">
              <UButton
                v-for="locale in locales"
                :key="locale.code"
                :color="$locale === locale.code ? 'primary' : 'neutral'"
                :variant="$locale === locale.code ? 'solid' : 'ghost'"
                size="xs"
                @click="setLocale(locale.code)"
              >
                {{ locale.code.toUpperCase() }}
              </UButton>
            </div>

            
            <UButton
              icon="lucide:menu"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="$t('navigation.menu')"
              class="lg:hidden"
              @click="toggleMobileMenu"
            />
          </div>
        </div>
      </div>
    </header>

    
    <div 
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 z-50 bg-black/50"
      @click="closeMobileMenu"
    >
      <div 
        class="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ $t('navigation.menu') }}
            </h2>
            <UButton
              icon="lucide:x"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="$t('common.close')"
              @click="closeMobileMenu"
            />
          </div>
          
          <nav class="space-y-2">
            <UButton
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              :icon="item.icon"
              :color="isActiveRoute(item.to) ? 'primary' : 'neutral'"
              :variant="isActiveRoute(item.to) ? 'solid' : 'ghost'"
              class="w-full justify-start px-4 py-3"
              :title="item.description"
              @click="closeMobileMenu"
            >
              <span class="ml-3">{{ item.label }}</span>
            </UButton>
          </nav>
        </div>
      </div>
    </div>

    
    <main id="main-content" class="flex-1 min-h-[calc(100vh-4rem)]" tabindex="-1">
      <slot />
    </main>

    
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="container mx-auto px-4 lg:px-6 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <UIcon name="lucide:heart" class="w-4 h-4 text-red-500" />
            <span class="text-sm">{{ $t('footer.developedBy') }} <a href="http://github.com/felipeO16/" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline">Felipe</a></span>
          </div>
          
          <div class="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span>{{ $t('footer.copyright') }}</span>
            <span class="hidden sm:inline">•</span>
            <span class="hidden sm:inline">{{ $t('footer.subtitle') }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
