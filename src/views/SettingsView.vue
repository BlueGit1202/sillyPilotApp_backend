<template>
  <div class="flex flex-col h-full p-4 space-y-4 overflow-y-auto scrollbar-hide">
    <!-- AI Provider Settings -->
    <div class="bg-catppuccin-surface0 rounded-lg p-4 space-y-4">
      <h2 class="text-xl font-semibold text-catppuccin-lavender">AI Provider</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-catppuccin-subtext0 mb-2">Provider</label>
          <select v-model="settings.aiProvider"
                  class="w-full bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                         border border-catppuccin-overlay0 focus:border-catppuccin-blue
                         focus:ring-1 focus:ring-catppuccin-blue outline-none">
            <option value="openrouter">OpenRouter</option>
            <option value="sillytavern">SillyTavern</option>
          </select>
        </div>

        <template v-if="settings.aiProvider === 'openrouter'">
          <div>
            <label class="block text-sm text-catppuccin-subtext0 mb-2">OpenRouter API Key</label>
            <input v-model="settings.openRouterApiKey"
                   type="password"
                   class="w-full bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                          border border-catppuccin-overlay0 focus:border-catppuccin-blue
                          focus:ring-1 focus:ring-catppuccin-blue outline-none">
          </div>
        </template>

        <template v-else>
          <div>
            <label class="block text-sm text-catppuccin-subtext0 mb-2">SillyTavern IP</label>
            <input v-model="settings.sillyTavernIp"
                   type="text"
                   class="w-full bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                          border border-catppuccin-overlay0 focus:border-catppuccin-blue
                          focus:ring-1 focus:ring-catppuccin-blue outline-none">
          </div>
          <div>
            <label class="block text-sm text-catppuccin-subtext0 mb-2">SillyTavern Port</label>
            <input v-model="settings.sillyTavernPort"
                   type="text"
                   class="w-full bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                          border border-catppuccin-overlay0 focus:border-catppuccin-blue
                          focus:ring-1 focus:ring-catppuccin-blue outline-none">
          </div>
        </template>
      </div>
    </div>

    <!-- Theme Settings -->
    <div class="bg-catppuccin-surface0 rounded-lg p-4 space-y-4">
      <h2 class="text-xl font-semibold text-catppuccin-lavender">Theme</h2>
      <div>
        <label class="block text-sm text-catppuccin-subtext0 mb-2">Color Theme</label>
        <select v-model="settings.theme"
                class="w-full bg-catppuccin-base text-catppuccin-text px-4 py-2 rounded-lg
                       border border-catppuccin-overlay0 focus:border-catppuccin-blue
                       focus:ring-1 focus:ring-catppuccin-blue outline-none">
          <option value="mocha">Mocha (Dark)</option>
          <option value="latte">Latte (Light)</option>
        </select>
      </div>
    </div>

    <!-- Log Section -->
    <div class="bg-catppuccin-surface0 rounded-lg p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-catppuccin-lavender">Log</h2>
        <button @click="clearLog" 
                class="text-sm text-catppuccin-red hover:text-catppuccin-maroon transition-colors">
          Clear Log
        </button>
      </div>
      <div class="bg-catppuccin-base rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm">
        <div v-if="logEntries.length === 0" 
             class="text-catppuccin-overlay0 text-center py-4">
          No log entries
        </div>
        <div v-for="(entry, index) in logEntries" 
             :key="index"
             class="py-1"
             :class="{
               'text-catppuccin-red': entry.type === 'error',
               'text-catppuccin-yellow': entry.type === 'warning',
               'text-catppuccin-text': entry.type === 'info'
             }">
          <span class="text-catppuccin-overlay0">{{ formatTimestamp(entry.timestamp) }}</span>
          <span class="ml-2">{{ entry.message }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="sticky bottom-0 bg-catppuccin-base pt-4 space-y-3">
      <button @click="saveSettings"
              class="w-full bg-catppuccin-blue text-catppuccin-base p-4 rounded-lg
                     hover:bg-catppuccin-sapphire transition-colors font-medium">
        Save Settings
      </button>
      
      <button @click="factoryReset"
              class="w-full bg-catppuccin-red text-catppuccin-base p-4 rounded-lg
                     hover:bg-catppuccin-maroon transition-colors font-medium">
        Factory Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

const settings = ref({ ...appStore.state.settings });
const logEntries = ref<LogEntry[]>([
  {
    timestamp: new Date().toISOString(),
    message: 'Application started',
    type: 'info'
  }
]);

async function saveSettings() {
  try {
    await appStore.updateSettings(settings.value);
    addLogEntry('Settings saved successfully', 'info');
  } catch (error) {
    addLogEntry('Failed to save settings: ' + (error as Error).message, 'error');
  }
}

async function factoryReset() {
  if (!confirm('Are you sure you want to reset all settings and data? This cannot be undone.')) {
    return;
  }

  try {
    await appStore.factoryReset();
    settings.value = { ...appStore.state.settings };
    addLogEntry('Factory reset completed', 'info');
  } catch (error) {
    addLogEntry('Failed to perform factory reset: ' + (error as Error).message, 'error');
  }
}

function addLogEntry(message: string, type: LogEntry['type'] = 'info') {
  logEntries.value.unshift({
    timestamp: new Date().toISOString(),
    message,
    type
  });
}

function clearLog() {
  logEntries.value = [];
  addLogEntry('Log cleared', 'info');
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

onMounted(() => {
  // Load initial settings
  settings.value = { ...appStore.state.settings };
  addLogEntry('Settings loaded', 'info');
});
</script>
