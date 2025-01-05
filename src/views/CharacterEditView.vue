<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="bg-catppuccin-surface1 p-4 flex justify-between items-center shadow-lg">
      <h2 class="text-2xl font-semibold text-catppuccin-lavender">
        {{ isNewCharacter ? 'Create New Character' : 'Edit Character' }}
      </h2>
    </div>

    <!-- Form -->
    <div class="flex-grow overflow-y-auto p-6 scrollbar-hide">
      <div class="max-w-lg mx-auto space-y-6">
        <!-- Character Image Upload -->
        <div class="settings-item space-y-2">
          <div class="flex items-center space-x-4">
            <div class="relative w-24 h-24">
              <img v-if="characterImage"
                   :src="characterImage"
                   alt="Character Avatar"
                   class="w-full h-full rounded-lg object-cover ring-2 ring-catppuccin-lavender">
              <div v-else
                   class="w-full h-full rounded-lg bg-catppuccin-surface0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-12 w-12 text-catppuccin-overlay0"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="flex-grow">
              <label class="text-sm text-catppuccin-sky block mb-2">Character Image</label>
              <input type="file"
                     @change="handleImageUpload"
                     accept="image/*"
                     class="w-full text-sm text-catppuccin-sky
                            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                            file:text-sm file:font-semibold file:bg-catppuccin-blue
                            file:text-catppuccin-base hover:file:bg-catppuccin-sapphire
                            file:transition-colors file:cursor-pointer">
              <p class="text-xs text-catppuccin-text mt-2">
                Upload a character card image or create a new character manually
              </p>
            </div>
          </div>
        </div>

        <!-- Name -->
        <div class="settings-item space-y-2">
          <label for="characterName" class="text-sm text-catppuccin-sky block">Name</label>
          <input v-model="character.name"
                 type="text"
                 id="characterName"
                 class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                        focus:ring-catppuccin-lavender border-none outline-none shadow-inner">
        </div>

        <!-- Description -->
        <div class="settings-item space-y-2">
          <label for="characterDescription" class="text-sm text-catppuccin-sky block">Description</label>
          <textarea v-model="character.character_data.description"
                    id="characterDescription"
                    rows="3"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"></textarea>
        </div>

        <!-- Personality -->
        <div class="settings-item space-y-2">
          <label for="characterPersonality" class="text-sm text-catppuccin-sky block">Personality</label>
          <textarea v-model="character.character_data.personality"
                    id="characterPersonality"
                    rows="3"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"></textarea>
        </div>

        <!-- Scenario -->
        <div class="settings-item space-y-2">
          <label for="characterScenario" class="text-sm text-catppuccin-sky block">Scenario</label>
          <textarea v-model="character.character_data.scenario"
                    id="characterScenario"
                    rows="3"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"></textarea>
        </div>

        <!-- First Message -->
        <div class="settings-item space-y-2">
          <label for="characterFirstMessage" class="text-sm text-catppuccin-sky block">First Message</label>
          <textarea v-model="character.character_data.first_mes"
                    id="characterFirstMessage"
                    rows="3"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"></textarea>
        </div>

        <!-- System Prompt -->
        <div class="settings-item space-y-2">
          <label for="systemPrompt" class="text-sm text-catppuccin-sky block">System Prompt</label>
          <textarea v-model="character.character_data.system_prompt"
                    id="systemPrompt"
                    rows="3"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"
                    placeholder="Instructions for the AI about how to roleplay this character"></textarea>
        </div>

        <!-- Creator Notes -->
        <div class="settings-item space-y-2">
          <label for="creatorNotes" class="text-sm text-catppuccin-sky block">Creator Notes</label>
          <textarea v-model="character.character_data.creator_notes"
                    id="creatorNotes"
                    rows="2"
                    class="w-full bg-catppuccin-surface0 p-3 rounded-lg focus:ring-2
                           focus:ring-catppuccin-lavender border-none outline-none shadow-inner"></textarea>
        </div>

        <!-- Tags -->
        <div class="settings-item space-y-2">
          <label class="text-sm text-catppuccin-sky block">Tags</label>
          <div class="flex flex-wrap gap-2">
            <div v-for="tag in character.character_data.tags"
                 :key="tag"
                 class="bg-catppuccin-surface0 px-3 py-1 rounded-full flex items-center space-x-2">
              <span>{{ tag }}</span>
              <button @click="removeTag(tag)"
                      class="text-catppuccin-overlay0 hover:text-catppuccin-red transition-colors">
                ×
              </button>
            </div>
            <input v-model="newTag"
                   @keydown.enter.prevent="addTag"
                   type="text"
                   placeholder="Add tag..."
                   class="bg-catppuccin-surface0 px-3 py-1 rounded-full focus:ring-2
                          focus:ring-catppuccin-lavender border-none outline-none">
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-4 bg-catppuccin-surface1 shadow-lg">
      <div class="flex space-x-4">
        <button @click="cancel"
                class="flex-1 p-4 rounded-lg bg-catppuccin-surface0 text-catppuccin-text
                       hover:bg-catppuccin-surface2 transition-colors">
          Cancel
        </button>
        <button @click="save"
                class="flex-1 p-4 rounded-lg bg-catppuccin-blue text-catppuccin-base
                       hover:bg-catppuccin-sapphire transition-all transform hover:scale-[1.02]
                       shadow-lg font-medium">
          {{ isNewCharacter ? 'Create Character' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCharacterStore } from '@/stores/character';
import { useAppStore } from '@/stores/app';
import type { Character, CharacterData } from '@/types';

const characterStore = useCharacterStore();
const appStore = useAppStore();

// State
const newTag = ref('');
const character = ref<Character>({
  name: '',
  character_data: {
    name: '',
    description: '',
    personality: '',
    scenario: '',
    first_mes: '',
    mes_example: '',
    creator_notes: '',
    system_prompt: '',
    post_history_instructions: '',
    alternate_greetings: [],
    tags: [],
    creator: '',
    character_version: '1.0',
    extensions: {}
  }
});

// Initialize character if editing
if (!characterStore.state.characterState.isNewCharacter && 
    characterStore.state.characterState.editingCharacter) {
  character.value = { ...characterStore.state.characterState.editingCharacter };
}

// Computed
const isNewCharacter = computed(() => characterStore.state.characterState.isNewCharacter);
const characterImage = computed(() => character.value.character_data.avatar_url);

// Methods
async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    try {
      const result = await characterStore.uploadCharacterImage(input.files[0]);
      if (result.success && result.character) {
        character.value = { ...result.character };
      }
    } catch (error) {
      console.error('Failed to upload character image:', error);
    }
  }
}

function addTag() {
  if (newTag.value.trim() && !character.value.character_data.tags.includes(newTag.value.trim())) {
    character.value.character_data.tags.push(newTag.value.trim());
    newTag.value = '';
  }
}

function removeTag(tag: string) {
  character.value.character_data.tags = character.value.character_data.tags.filter(t => t !== tag);
}

async function save() {
  try {
    // Ensure name is set in character_data
    character.value.character_data.name = character.value.name;
    await characterStore.saveCharacter();
  } catch (error) {
    console.error('Failed to save character:', error);
  }
}

function cancel() {
  characterStore.resetCharacterState();
  appStore.setCurrentView('home');
}
</script>

<style scoped>
.settings-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
