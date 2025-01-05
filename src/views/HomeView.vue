<template>
  <div class="relative h-[100dvh] w-full bg-catppuccin-base overflow-hidden">
    <!-- Main Content -->
    <main class="h-full w-full overflow-y-auto pb-[140px] px-4 pt-4 space-y-4 scrollbar-hide">
      <!-- Chat List -->
      <div v-if="sortedChats.length > 0" class="space-y-4">
        <div v-for="chat in sortedChats" 
             :key="chat.id" 
             @click="openChat(chat)"
             class="chat-list-item bg-catppuccin-surface0 p-4 rounded-lg flex items-center space-x-4 
                    cursor-pointer hover:bg-catppuccin-surface1 shadow-md transition-all duration-200">
          <img :src="getCharacterImage(chat)" 
               :alt="chat.name"
               class="w-12 h-12 rounded-full object-cover ring-2 ring-catppuccin-lavender">
          <div class="flex-grow">
            <p class="text-lg font-medium text-catppuccin-lavender">{{ chat.name }}</p>
            <div class="flex items-center space-x-2">
              <p class="text-sm text-catppuccin-sky">
                {{ chat.last_message_time || 'No messages yet' }}
              </p>
              <span v-if="chat.last_message" 
                    class="text-xs text-catppuccin-text truncate max-w-[200px]">
                {{ chat.last_message }}
              </span>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 text-catppuccin-lavender" 
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-grow flex flex-col items-center justify-center space-y-4 min-h-[60vh]">
        <div class="text-6xl animate-float">✨</div>
        <p class="text-xl text-catppuccin-lavender">Welcome to SillyPilot!</p>
        <p class="text-center text-catppuccin-text max-w-md">
          Create your first chat by clicking the button below to get started.
        </p>
      </div>
    </main>

    <!-- Action Buttons -->
    <footer class="fixed bottom-0 left-0 right-0 z-30 bg-catppuccin-surface1/95 backdrop-blur-lg shadow-lg">
      <div class="container mx-auto px-4 py-3 space-y-3">
        <!-- Browse Characters Button -->
        <button @click="navigateTo('browse')" 
                class="w-full bg-catppuccin-surface0 text-catppuccin-text p-3 rounded-lg 
                       hover:bg-catppuccin-surface2 transition-all transform 
                       hover:scale-[1.02] shadow-lg font-medium border border-catppuccin-overlay0">
          Browse Characters 🎭
        </button>

        <!-- New Chat Button -->
        <button @click="createNewChat" 
                class="w-full bg-catppuccin-blue text-catppuccin-base p-3 rounded-lg 
                       hover:bg-catppuccin-sapphire transition-all transform 
                       hover:scale-[1.02] shadow-lg font-medium">
          New Chat ✨
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from '../stores/chat';
import { useCharacterStore } from '../stores/character';
import type { Chat } from '../types';

const router = useRouter();
const chatStore = useChatStore();
const characterStore = useCharacterStore();

// Computed
const sortedChats = computed(() => chatStore.sortedChats);

// Methods
function getCharacterImage(chat: Chat): string {
  if (chat?.character_data?.avatar_url) {
    return chat.character_data.avatar_url;
  }
  // Fallback to a generated avatar using the chat ID as a seed
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${chat.id || 'default'}`;
}

async function openChat(chat: Chat) {
  if (chat.id) {
    await chatStore.openChat(chat.id);
  }
}

function createNewChat() {
  characterStore.startCharacterCreation();
}

function navigateTo(route: string) {
  router.push(`/${route}`);
}
</script>

<style scoped>
.chat-list-item {
  will-change: transform;
}

.chat-list-item:hover {
  transform: translateX(4px);
}

.chat-list-item:active {
  transform: scale(0.98);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}
</style>
