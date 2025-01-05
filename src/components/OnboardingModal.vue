<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-catppuccin-base bg-opacity-90"></div>

      <!-- Modal -->
      <div class="relative bg-catppuccin-surface0 rounded-lg shadow-xl max-w-lg w-full 
                  animate-fadeIn overflow-hidden">
        <!-- Progress bar -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-catppuccin-surface1">
          <div class="h-full bg-catppuccin-blue transition-all duration-300"
               :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Step 1: Welcome -->
          <div v-if="currentStep === 1" class="space-y-4">
            <div class="text-6xl text-center animate-float">✨</div>
            <h2 class="text-2xl font-semibold text-catppuccin-lavender text-center">
              Welcome to SillyPilot!
            </h2>
            <p class="text-center text-catppuccin-text">
              Let's get you set up with your AI companion. We'll guide you through the process
              step by step.
            </p>
          </div>

          <!-- Step 2: AI Provider Selection -->
          <div v-if="currentStep === 2" class="space-y-4">
            <h2 class="text-xl font-semibold text-catppuccin-lavender">
              Choose Your AI Provider
            </h2>
            <div class="space-y-4">
              <button @click="selectProvider('openrouter')"
                      class="w-full p-4 rounded-lg transition-all duration-200"
                      :class="[
                        settings.aiProvider === 'openrouter'
                          ? 'bg-catppuccin-blue text-catppuccin-base'
                          : 'bg-catppuccin-surface1 hover:bg-catppuccin-surface2'
                      ]">
                <div class="font-medium">OpenRouter</div>
                <div class="text-sm opacity-80">
                  Direct API access to various language models
                </div>
              </button>
              <button @click="selectProvider('sillytavern')"
                      class="w-full p-4 rounded-lg transition-all duration-200"
                      :class="[
                        settings.aiProvider === 'sillytavern'
                          ? 'bg-catppuccin-blue text-catppuccin-base'
                          : 'bg-catppuccin-surface1 hover:bg-catppuccin-surface2'
                      ]">
                <div class="font-medium">SillyTavern</div>
                <div class="text-sm opacity-80">
                  Connect to your local SillyTavern instance
                </div>
              </button>
            </div>
          </div>

          <!-- Step 3: Provider Configuration -->
          <div v-if="currentStep === 3" class="space-y-4">
            <h2 class="text-xl font-semibold text-catppuccin-lavender">
              Configure {{ settings.aiProvider === 'openrouter' ? 'OpenRouter' : 'SillyTavern' }}
            </h2>
            
            <template v-if="settings.aiProvider === 'openrouter'">
              <div class="space-y-2">
                <label class="text-sm text-catppuccin-sky block">API Key</label>
                <div class="relative">
                  <input :type="showApiKey ? 'text' : 'password'"
                         v-model="settings.openRouterApiKey"
                         class="w-full bg-catppuccin-surface1 p-3 rounded-lg focus:ring-2
                                focus:ring-catppuccin-lavender border-none outline-none"
                         placeholder="Enter your OpenRouter API key">
                  <button @click="showApiKey = !showApiKey"
                          class="absolute right-3 top-1/2 transform -translate-y-1/2
                                 text-catppuccin-lavender hover:text-catppuccin-blue">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         class="h-5 w-5"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path v-if="showApiKey"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      <path v-else
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-catppuccin-text">
                  Don't have an API key? 
                  <a href="https://openrouter.ai/keys" 
                     target="_blank"
                     class="text-catppuccin-blue hover:text-catppuccin-sapphire">
                    Get one here
                  </a>
                </p>
              </div>
            </template>

            <template v-else>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm text-catppuccin-sky block">IP Address</label>
                  <input v-model="settings.sillyTavernIp"
                         class="w-full bg-catppuccin-surface1 p-3 rounded-lg focus:ring-2
                                focus:ring-catppuccin-lavender border-none outline-none"
                         placeholder="localhost">
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-catppuccin-sky block">Port</label>
                  <input v-model="settings.sillyTavernPort"
                         class="w-full bg-catppuccin-surface1 p-3 rounded-lg focus:ring-2
                                focus:ring-catppuccin-lavender border-none outline-none"
                         placeholder="8000">
                </div>
                <p class="text-xs text-catppuccin-text">
                  Make sure you have the STAHP plugin installed and enabled in SillyTavern
                </p>
              </div>
            </template>
          </div>

          <!-- Step 4: Theme Selection -->
          <div v-if="currentStep === 4" class="space-y-4">
            <h2 class="text-xl font-semibold text-catppuccin-lavender">
              Choose Your Theme
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <button v-for="theme in ['mocha', 'macchiato', 'frappe', 'latte']"
                      :key="theme"
                      @click="settings.theme = theme"
                      class="p-4 rounded-lg transition-all duration-200 capitalize"
                      :class="[
                        settings.theme === theme
                          ? 'bg-catppuccin-blue text-catppuccin-base'
                          : 'bg-catppuccin-surface1 hover:bg-catppuccin-surface2'
                      ]">
                {{ theme }}
              </button>
            </div>
          </div>

          <!-- Step 5: Completion -->
          <div v-if="currentStep === 5" class="space-y-4">
            <div class="text-6xl text-center animate-float">🎉</div>
            <h2 class="text-2xl font-semibold text-catppuccin-lavender text-center">
              All Set!
            </h2>
            <p class="text-center text-catppuccin-text">
              You're ready to start chatting with your AI companions. Click finish to begin!
            </p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="p-4 bg-catppuccin-surface1 flex justify-between">
          <button v-if="currentStep > 1"
                  @click="currentStep--"
                  class="px-4 py-2 rounded-lg bg-catppuccin-surface0
                         hover:bg-catppuccin-surface2 transition-colors">
            Back
          </button>
          <div v-else class="w-20"></div>

          <button @click="currentStep < totalSteps ? currentStep++ : complete()"
                  :disabled="isStepInvalid"
                  class="px-4 py-2 rounded-lg transition-colors"
                  :class="[
                    isStepInvalid
                      ? 'bg-catppuccin-overlay0 cursor-not-allowed'
                      : 'bg-catppuccin-blue hover:bg-catppuccin-sapphire text-catppuccin-base'
                  ]">
            {{ currentStep < totalSteps ? 'Next' : 'Finish' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import type { Settings } from '@/types';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const appStore = useAppStore();
const currentStep = ref(1);
const totalSteps = 5;
const showApiKey = ref(false);
const settings = ref<Settings>({
  aiProvider: 'openrouter',
  sillyTavernIp: 'localhost',
  sillyTavernPort: '8000',
  openRouterApiKey: '',
  theme: 'mocha'
});

const isStepInvalid = computed(() => {
  if (currentStep.value === 3) {
    if (settings.value.aiProvider === 'openrouter') {
      return !settings.value.openRouterApiKey;
    } else {
      return !settings.value.sillyTavernIp || !settings.value.sillyTavernPort;
    }
  }
  return false;
});

function selectProvider(provider: 'openrouter' | 'sillytavern') {
  settings.value.aiProvider = provider;
}

async function complete() {
  try {
    await appStore.updateSettings(settings.value);
    emit('complete');
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
