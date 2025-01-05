<template>
  <div class="h-screen flex flex-col bg-catppuccin-base text-catppuccin-text">
    <!-- Loading State -->
    <LoadingOverlay v-if="isInitializing"
                   message="Loading SillyPilot"
                   sub-message="Initializing application..." />

    <!-- Server Error -->
    <div v-else-if="!isOnline" 
         class="h-screen flex flex-col items-center justify-center p-6 text-center">
      <div class="text-6xl mb-4 animate-pulse">🔌</div>
      <h1 class="text-2xl font-semibold text-catppuccin-lavender mb-2">
        Connection Error
      </h1>
      <p class="text-catppuccin-text mb-6 max-w-md">
        Unable to connect to the server. Please make sure the server is running and try again.
      </p>
      <button @click="retryConnection"
              class="px-6 py-3 bg-catppuccin-blue text-catppuccin-base rounded-lg
                     hover:bg-catppuccin-sapphire transition-colors">
        Retry Connection
      </button>
    </div>

    <!-- Main App -->
    <template v-else>
      <!-- Navigation Header -->
      <nav class="bg-catppuccin-surface1 p-4 flex justify-between items-center shadow-lg">
        <router-link to="/" class="nav-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </router-link>
        <h1 class="text-2xl font-semibold text-catppuccin-lavender">{{ pageTitle }}</h1>
        <div class="flex items-center space-x-4">
          <router-link to="/about" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </router-link>
          <router-link to="/settings" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </router-link>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-grow overflow-hidden relative">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component 
              :is="Component" 
              class="h-full overflow-y-auto scrollbar-hide"
              :class="{'animate-slideIn': $route.name === 'home',
                      'animate-slideUp': $route.name === 'chat'}"
            />
          </transition>
        </router-view>
      </main>

      <!-- Status Bar -->
      <div class="bg-catppuccin-surface0 px-4 py-2 flex justify-between items-center text-sm 
                  border-t border-catppuccin-overlay0">
        <div class="flex items-center space-x-2">
          <div class="connection-status" :class="{ online: isOnline }">
            {{ serverStatus }}
          </div>
        </div>
        <div class="text-catppuccin-sky">
          {{ currentTheme }}
        </div>
      </div>

      <!-- Error Toast -->
      <Transition name="fade">
        <div v-if="error" 
             class="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg 
                    shadow-lg z-50"
             :class="[
               error.type === 'error' ? 'bg-catppuccin-red' : 
               error.type === 'warning' ? 'bg-catppuccin-peach' : 
               'bg-catppuccin-blue',
               'text-catppuccin-base'
             ]">
          {{ error.message }}
        </div>
      </Transition>

      <!-- Onboarding Modal -->
      <OnboardingModal 
        :show="showOnboarding"
        @complete="completeOnboarding"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from './stores/app';
import { useChatStore } from './stores/chat';
import { useCharacterStore } from './stores/character';
import LoadingOverlay from './components/LoadingOverlay.vue';
import OnboardingModal from './components/OnboardingModal.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const chatStore = useChatStore();
const characterStore = useCharacterStore();

// State
const isInitializing = ref(true);
const showOnboarding = ref(false);
const initializationAttempts = ref(0);
const maxInitializationAttempts = 3;

// Computed
const pageTitle = computed(() => {
  switch (route.name) {
    case 'home': return 'SillyPilot';
    case 'chat': return chatStore.state.currentChat?.name || 'Chat';
    case 'settings': return 'Settings';
    case 'character-edit':
      return characterStore.state.characterState.isNewCharacter
        ? 'Create New Character'
        : 'Edit Character';
    case 'browse': return 'Browse Characters';
    case 'about': return 'About';
    default: return 'SillyPilot';
  }
});

const isOnline = computed(() => appStore.isOnline);
const serverStatus = computed(() => appStore.state.serverStatus);
const currentTheme = computed(() => appStore.currentTheme);
const error = computed(() => chatStore.state.error);

// Methods
async function initializeApp() {
  try {
    initializationAttempts.value++;
    await Promise.all([
      appStore.initialize(),
      characterStore.initialize(),
      chatStore.fetchChats()
    ]);
    
    // Show onboarding if database is empty
    showOnboarding.value = appStore.state.isDatabaseEmpty;
    isInitializing.value = false;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    if (initializationAttempts.value < maxInitializationAttempts) {
      // Retry initialization after a delay
      setTimeout(initializeApp, 2000);
    } else {
      isInitializing.value = false;
    }
  }
}

async function retryConnection() {
  isInitializing.value = true;
  initializationAttempts.value = 0;
  await initializeApp();
}

function completeOnboarding() {
  showOnboarding.value = false;
  appStore.state.isDatabaseEmpty = false;
}

// Watch for theme changes
watch(() => appStore.state.settings.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
});

// Watch for route changes to update app store
watch(() => route.name, (newRouteName) => {
  if (newRouteName) {
    appStore.setCurrentView(newRouteName as string);
  }
});

// Lifecycle
onMounted(() => {
  initializeApp();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.nav-button {
  @apply text-catppuccin-lavender hover:text-catppuccin-blue 
         transition-all transform hover:scale-110;
}

.connection-status {
  @apply px-2 py-1 rounded-full text-xs transition-colors;
}

.connection-status.online {
  @apply bg-catppuccin-green text-catppuccin-base;
}

.connection-status:not(.online) {
  @apply bg-catppuccin-red text-catppuccin-base;
}

[data-theme="mocha"] {
  color-scheme: dark;
}

[data-theme="latte"] {
  color-scheme: light;
}
</style>
