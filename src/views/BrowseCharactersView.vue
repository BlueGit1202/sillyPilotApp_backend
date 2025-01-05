<template>
  <div class="flex flex-col h-full p-4 space-y-4 overflow-y-auto scrollbar-hide">
    <!-- Repository URL Input -->
    <div class="bg-catppuccin-surface0 p-4 rounded-lg shadow-md">
      <label class="block text-sm text-catppuccin-subtext0 mb-2">
        Character Repository URL
      </label>
      <div class="flex space-x-2">
        <input 
          v-model="repositoryUrl"
          type="text"
          placeholder="Enter repository URL..."
          class="flex-grow bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                 border border-catppuccin-overlay0 focus:border-catppuccin-blue
                 focus:ring-1 focus:ring-catppuccin-blue outline-none"
        >
        <button 
          @click="loadRepository"
          class="bg-catppuccin-blue text-catppuccin-base px-6 py-2 rounded-lg
                 hover:bg-catppuccin-sapphire transition-colors font-medium"
        >
          Load
        </button>
      </div>
    </div>

    <!-- Empty State / Gallery -->
    <div class="flex-grow flex flex-col items-center justify-center space-y-6 
                bg-catppuccin-surface0 rounded-lg p-8">
      <div class="text-6xl animate-float">🎭</div>
      <div class="text-center space-y-2">
        <h2 class="text-xl font-semibold text-catppuccin-lavender">
          Character Gallery Coming Soon
        </h2>
        <p class="text-catppuccin-text max-w-md">
          This space will soon feature a curated collection of characters that you can download 
          and add to your chats. Stay tuned!
        </p>
      </div>

      <!-- Placeholder Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
        <div v-for="n in 6" :key="n" 
             class="aspect-square bg-catppuccin-surface1 rounded-lg animate-pulse">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const repositoryUrl = ref('');

async function loadRepository() {
  if (!repositoryUrl.value) return;
  
  // TODO: Implement repository loading logic
  console.log('Loading repository:', repositoryUrl.value);
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
