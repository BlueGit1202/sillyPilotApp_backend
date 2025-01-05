<template>
  <div class="relative h-[100dvh] w-full bg-catppuccin-base overflow-hidden">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-30 bg-catppuccin-surface1/95 backdrop-blur-lg px-3 py-2 flex items-center space-x-3 shadow-lg">
      <img :src="getCharacterImage" 
           :alt="currentChat?.name"
           class="w-8 h-8 rounded-full object-cover ring-2 ring-catppuccin-lavender">
      <div class="flex-grow min-w-0">
        <h2 class="text-base font-medium text-catppuccin-lavender truncate">{{ currentChat?.name }}</h2>
        <div class="flex items-center space-x-2">
          <div class="connection-status" :class="{ online: isOnline }">
            {{ serverStatus }}
          </div>
          <span v-if="currentChat?.character_data" class="text-xs text-catppuccin-sky truncate">
            {{ characterMood }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <button @click="toggleIdleMode" 
                class="idle-toggle p-1.5 rounded-full transition-colors"
                :class="{'bg-catppuccin-yellow text-catppuccin-base': isIdle}">
          <span class="text-base">💤</span>
        </button>
        <div class="idle-slider ml-2" :class="isIdle ? 'active' : 'inactive'">
          <input type="range" 
                 v-model="idleTime" 
                 min="1" 
                 max="60"
                 class="w-full h-2 bg-catppuccin-surface0 rounded-lg appearance-none cursor-pointer"
                 :style="{ background: `linear-gradient(to right, rgb(249, 226, 175) ${(idleTime/60)*100}%, rgb(49, 50, 68) ${(idleTime/60)*100}%)` }">
          <div class="text-xs text-center mt-1 text-catppuccin-text">{{ idleTime }}m</div>
        </div>
      </div>
    </header>

    <!-- Messages -->
    <main class="h-full w-full overflow-y-auto pt-[60px] pb-[140px] px-3 space-y-2 scrollbar-hide bg-[url('/pattern.png')] bg-repeat"
         ref="chatFeed"
         @scroll="handleScroll">
      <div v-for="(message, index) in currentMessages"
           :key="message.id"
           class="flex relative"
           :class="{'justify-end': message.role === 'user'}">
        <img v-if="message.role === 'assistant'"
             :src="getCharacterImage"
             :alt="currentChat?.name"
             class="character-avatar">
        <div :class="['chat-bubble', message.role]">
          <div class="flex justify-between items-start space-x-2">
            <div class="flex items-center">
              <span class="timestamp">{{ message.timestamp }}</span>
              <span v-if="message.role === 'assistant'"
                    class="emotion-indicator ml-1">
                {{ getMessageEmotion(message.content) }}
              </span>
            </div>
            <button v-if="message.role === 'user'"
                    @click="regenerateMessage(index)"
                    class="regenerate-btn text-xs px-1.5 py-0.5 rounded-full bg-catppuccin-overlay0 
                           hover:bg-catppuccin-mauve transition-colors">
              ↺
            </button>
          </div>
          <p class="whitespace-pre-wrap leading-relaxed mt-1 text-sm">{{ message.content }}</p>
          <img v-if="message.image"
               :src="message.image"
               class="mt-2 rounded-lg max-w-full h-auto"
               @click="openImagePreview(message.image)" />
        </div>
      </div>
      <div v-if="isTyping" class="flex justify-start">
        <div class="chat-bubble assistant">
          <span class="text-catppuccin-sky animate-float">૮ • ﻌ - ა</span>
        </div>
      </div>
    </main>

    <!-- Go to Bottom Button -->
    <button v-if="showScrollButton"
            @click="scrollToBottom"
            class="fixed bottom-[150px] right-3 bg-catppuccin-surface1/80 backdrop-blur-sm p-2 rounded-full shadow-lg
                   animate-fadeIn hover:bg-catppuccin-surface2/80 transition-colors z-30">
      <svg xmlns="http://www.w3.org/2000/svg"
           class="h-4 w-4"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 z-30 bg-catppuccin-surface1/95 backdrop-blur-lg shadow-lg">
      <div class="container mx-auto px-3 py-3 space-y-2">
        <!-- Chat Input Area -->
        <div class="flex items-center space-x-2">
          <button @click="focusInput"
                  class="flex-shrink-0 bg-catppuccin-mauve/90 p-2 rounded-lg hover:bg-catppuccin-pink/90
                         transition-colors backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-5 w-5"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          
          <ChatInput
            v-model="messageText"
            @send="sendMessage"
            ref="chatInputRef"
            class="flex-grow"
          />
          
          <input type="file"
                 ref="imageInput"
                 @change="handleImageUpload"
                 accept="image/*"
                 class="hidden">
          <button @click="$refs.imageInput.click()"
                  class="flex-shrink-0 bg-catppuccin-mauve/90 p-2 rounded-lg hover:bg-catppuccin-pink/90
                         transition-colors backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-5 w-5"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../stores/app';
import { useChatStore } from '../stores/chat';
import ChatInput from '../components/ChatInput.vue';
import type { Message } from '../types';

const route = useRoute();
const appStore = useAppStore();
const chatStore = useChatStore();

// Refs
const chatFeed = ref<HTMLElement | null>(null);
const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const messageText = ref('');

// Computed
const currentChat = computed(() => chatStore.state.currentChat);
const currentMessages = computed(() => chatStore.currentMessages);
const isTyping = computed(() => appStore.state.isTyping);
const showScrollButton = computed(() => appStore.state.showScrollButton);
const isOnline = computed(() => appStore.isOnline);
const serverStatus = computed(() => appStore.state.serverStatus);
const isIdle = computed(() => appStore.state.isIdle);
const idleTime = computed({
  get: () => appStore.state.idleTime,
  set: (value: number) => appStore.setIdleTime(value)
});

const getCharacterImage = computed(() => {
  if (currentChat.value?.character_data?.avatar_url) {
    return currentChat.value.character_data.avatar_url;
  }
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${currentChat.value?.id || 'default'}`;
});

const characterMood = computed(() => {
  if (!currentMessages.value.length) return '😊 Cheerful';
  
  const recentMessages = currentMessages.value
    .filter(m => m.role === 'assistant')
    .slice(-3);
    
  if (!recentMessages.length) return '😊 Cheerful';
  
  const lastMessage = recentMessages[recentMessages.length - 1].content.toLowerCase();
  
  if (lastMessage.includes('*laugh') || lastMessage.includes('haha')) return '😄 Happy';
  if (lastMessage.includes('*smile') || lastMessage.includes('*grin')) return '😊 Cheerful';
  if (lastMessage.includes('*blush') || lastMessage.includes('*shy')) return '😳 Shy';
  if (lastMessage.includes('*think') || lastMessage.includes('*ponder')) return '🤔 Thoughtful';
  if (lastMessage.includes('*excited') || lastMessage.includes('*bounce')) return '🌟 Excited';
  if (lastMessage.includes('*sad') || lastMessage.includes('*sigh')) return '😔 Sad';
  if (lastMessage.includes('*curious') || lastMessage.includes('*tilts head')) return '🤓 Curious';
  
  return '😊 Cheerful';
});

// Methods
function getMessageEmotion(content: string): string {
  const text = content.toLowerCase();
  const actions = text.match(/\*(.*?)\*/g) || [];
  
  if (actions.length) {
    const action = actions[0].toLowerCase();
    if (action.includes('laugh')) return '😄';
    if (action.includes('smile')) return '😊';
    if (action.includes('blush')) return '😳';
    if (action.includes('think')) return '🤔';
    if (action.includes('excited')) return '🌟';
    if (action.includes('sad')) return '😔';
    if (action.includes('curious')) return '🤓';
  }
  
  if (text.includes('haha') || text.includes('😄')) return '😄';
  if (text.includes('hmm') || text.includes('interesting')) return '🤔';
  if (text.includes('wow') || text.includes('amazing')) return '🌟';
  if (text.includes('oh no') || text.includes('sorry')) return '😔';
  if (text.includes('tell me more') || text.includes('what about')) return '🤓';
  
  return '😊';
}

function focusInput() {
  chatInputRef.value?.focus();
}

async function sendMessage() {
  if (!messageText.value.trim() && !chatStore.state.messageState.uploadedImage) return;
  
  await chatStore.sendMessage(
    messageText.value,
    chatStore.state.messageState.uploadedImage || undefined
  );
  
  messageText.value = '';
  await nextTick();
  scrollToBottom();
}

async function regenerateMessage(index: number) {
  if (!currentMessages.value[index]) return;
  await chatStore.regenerateMessage(currentMessages.value[index].id!);
  await nextTick();
  scrollToBottom();
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  appStore.setShowScrollButton(
    target.scrollTop < target.scrollHeight - target.clientHeight - 100
  );
}

function scrollToBottom() {
  if (chatFeed.value) {
    chatFeed.value.scrollTop = chatFeed.value.scrollHeight;
  }
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        chatStore.setUploadedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function toggleIdleMode() {
  appStore.toggleIdleMode();
  if (appStore.state.isIdle) {
    chatStore.startIdleMode();
  } else {
    chatStore.stopIdleMode();
  }
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

onUnmounted(() => {
  chatStore.stopIdleMode();
});

// Watch for route changes to refresh chat data
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await chatStore.openChat(Number(newId));
  }
}, { immediate: true });
</script>

<style scoped>
.idle-slider {
  @apply transition-all duration-200 overflow-hidden;
  width: 0;
  opacity: 0;
}

.idle-slider.active {
  width: 100px;
  opacity: 1;
}

.idle-slider.inactive {
  width: 0;
  opacity: 0;
}

input[type="range"] {
  @apply appearance-none bg-catppuccin-surface0 h-2 rounded-lg;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 rounded-full bg-catppuccin-yellow cursor-pointer;
}

.emotion-indicator {
  @apply text-sm opacity-70 transition-opacity duration-200;
}

.chat-bubble:hover .emotion-indicator {
  @apply opacity-100;
}

.chat-bubble {
  @apply rounded-xl p-2 max-w-[75%] break-words shadow-md;
}

.chat-bubble.user {
  @apply bg-catppuccin-blue/90 backdrop-blur-sm text-catppuccin-base ml-auto;
}

.chat-bubble.assistant {
  @apply bg-catppuccin-surface1/90 backdrop-blur-sm text-catppuccin-text;
}

.character-avatar {
  @apply w-6 h-6 rounded-full object-cover mr-1.5 flex-shrink-0;
}

.timestamp {
  @apply text-xs opacity-70;
}

.connection-status {
  @apply text-xs px-1.5 py-0.5 rounded-full bg-catppuccin-red/90 backdrop-blur-sm text-catppuccin-base;
}

.connection-status.online {
  @apply bg-catppuccin-green/90;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slideUp {
  animation: slideUp 0.3s ease-in-out;
}
</style>
