import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AppState, Settings } from '../types';
import axios from 'axios';

// Get the current machine's IP or hostname for the backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5006';

// Configure axios base URL
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; // Enable credentials for CORS

export const useAppStore = defineStore('app', () => {
  const state = ref<AppState>({
    currentView: 'home',
    chats: [],
    currentChat: null,
    settings: {
      aiProvider: 'openrouter',
      sillyTavernIp: '',
      sillyTavernPort: '',
      openRouterApiKey: '',
      theme: 'mocha',
      showFullResponses: false
    },
    serverStatus: 'checking',
    isDatabaseEmpty: true,
    isTyping: false,
    showScrollButton: false,
    isIdle: false,
    idleTime: 5
  });

  // Getters
  const isOnline = computed(() => state.value.serverStatus === 'online');
  const currentTheme = computed(() => state.value.settings.theme);

  // Actions
  async function checkServerStatus(): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: { status: 'online' | 'offline' } }>('/api/status');
      state.value.serverStatus = response.data.data.status;
    } catch (error) {
      state.value.serverStatus = 'offline';
      console.error('Server connection error:', error);
      console.log('Attempted to connect to:', axios.defaults.baseURL);
    }
  }

  async function loadSettings(): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: any }>('/api/settings');
      if (response.data.success) {
        // Convert snake_case to camelCase
        state.value.settings = {
          aiProvider: response.data.data.ai_provider,
          sillyTavernIp: response.data.data.sillytavern_ip,
          sillyTavernPort: response.data.data.sillytavern_port,
          openRouterApiKey: response.data.data.openrouter_api_key,
          theme: response.data.data.theme,
          showFullResponses: response.data.data.show_full_responses || false
        };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async function updateSettings(settings: Settings): Promise<void> {
    try {
      // Convert camelCase to snake_case
      const dbSettings = {
        ai_provider: settings.aiProvider,
        sillytavern_ip: settings.sillyTavernIp,
        sillytavern_port: settings.sillyTavernPort,
        openrouter_api_key: settings.openRouterApiKey,
        theme: settings.theme,
        show_full_responses: settings.showFullResponses
      };

      const response = await axios.post<{ success: boolean; data: any }>('/api/settings', dbSettings);
      if (response.data.success) {
        state.value.settings = settings;
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  async function checkDatabaseState(): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: { isEmpty: boolean } }>('/api/check-database');
      state.value.isDatabaseEmpty = response.data.data.isEmpty;
    } catch (error) {
      console.error('Failed to check database state:', error);
    }
  }

  function setCurrentView(view: AppState['currentView']): void {
    state.value.currentView = view;
  }

  function setIsTyping(value: boolean): void {
    state.value.isTyping = value;
  }

  function setShowScrollButton(value: boolean): void {
    state.value.showScrollButton = value;
  }

  function toggleIdleMode(): void {
    state.value.isIdle = !state.value.isIdle;
  }

  function setIdleTime(minutes: number): void {
    state.value.idleTime = minutes;
  }

  async function factoryReset(): Promise<void> {
    try {
      await axios.post('/api/factory-reset');
      state.value = {
        currentView: 'home',
        chats: [],
        currentChat: null,
        settings: {
          aiProvider: 'openrouter',
          sillyTavernIp: '',
          sillyTavernPort: '',
          openRouterApiKey: '',
          theme: 'mocha',
          showFullResponses: false
        },
        serverStatus: 'online',
        isDatabaseEmpty: true,
        isTyping: false,
        showScrollButton: false,
        isIdle: false,
        idleTime: 5
      };
    } catch (error) {
      console.error('Failed to perform factory reset:', error);
      throw error;
    }
  }

  // Initialize
  async function initialize(): Promise<void> {
    await Promise.all([
      checkServerStatus(),
      loadSettings(),
      checkDatabaseState()
    ]);
    
    // Start periodic status check
    setInterval(checkServerStatus, 60000);
  }

  return {
    state,
    isOnline,
    currentTheme,
    checkServerStatus,
    loadSettings,
    updateSettings,
    checkDatabaseState,
    setCurrentView,
    setIsTyping,
    setShowScrollButton,
    toggleIdleMode,
    setIdleTime,
    factoryReset,
    initialize
  };
});
