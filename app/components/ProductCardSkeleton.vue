<script setup lang="ts">
</script>

<template>
  <UCard
    :ui="{
      body: { padding: 'p-4' },
      header: { padding: 'p-0' }
    }"
    class="h-full flex flex-col"
  >
    <template #header>
      <USkeleton class="w-full h-48 rounded-t-lg" />
    </template>

    <div class="flex-1 flex flex-col space-y-3">
      <USkeleton class="h-6 w-3/4" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-2/3" />
      <USkeleton class="h-5 w-20" />
      
      <div class="flex items-center gap-2">
        <USkeleton class="h-4 w-16" />
        <USkeleton class="h-4 w-16" />
      </div>
      
      <div class="flex items-center justify-between mt-auto">
        <USkeleton class="h-6 w-24" />
        <div class="flex gap-2">
          <USkeleton class="h-8 w-8 rounded" />
          <USkeleton class="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  </UCard>
</template>