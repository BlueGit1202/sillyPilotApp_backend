<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-catppuccin-base">
    <div class="w-16 h-16 mb-4">
      <svg class="animate-spin" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" 
                stroke="currentColor" stroke-width="4" fill="none">
        </circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>
    <div class="text-lg font-medium text-catppuccin-lavender">
      {{ message || 'Loading...' }}
    </div>
    <div v-if="subMessage" class="mt-2 text-sm text-catppuccin-text">
      {{ subMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
  subMessage?: string;
}>();
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
