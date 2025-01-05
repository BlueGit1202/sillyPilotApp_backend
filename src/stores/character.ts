import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Character, CharacterState, UploadResult } from '../types';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useChatStore } from './chat';

export const useCharacterStore = defineStore('character', () => {
  const router = useRouter();
  const chatStore = useChatStore();

  const state = ref<{
    characters: Character[];
    characterState: CharacterState;
  }>({
    characters: [],
    characterState: {
      isNewCharacter: true,
      editingCharacter: null
    }
  });

  // Getters
  const sortedCharacters = computed(() => {
    return [...state.value.characters].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  });

  // Actions
  async function fetchCharacters(): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: Character[] }>('/api/characters');
      if (response.data.success) {
        state.value.characters = response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      throw error;
    }
  }

  async function createCharacter(character: Character): Promise<void> {
    try {
      const response = await axios.post<{ success: boolean; data: Character }>('/api/characters', character);
      if (response.data.success) {
        state.value.characters.unshift(response.data.data);
        // Create a new chat with this character
        await chatStore.createChat(
          response.data.data.id!,
          `Chat with ${response.data.data.name}`
        );
      }
    } catch (error) {
      console.error('Failed to create character:', error);
      throw error;
    }
  }

  async function uploadCharacterImage(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post<{ success: boolean; data: Character }>(
        '/api/upload-character-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        state.value.characterState.editingCharacter = response.data.data;
        return {
          success: true,
          character: response.data.data
        };
      }

      return {
        success: false,
        error: 'Failed to process character image'
      };
    } catch (error) {
      console.error('Failed to upload character image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  function setNewCharacter(value: boolean): void {
    state.value.characterState.isNewCharacter = value;
  }

  function setEditingCharacter(character: Character | null): void {
    state.value.characterState.editingCharacter = character;
  }

  function resetCharacterState(): void {
    state.value.characterState = {
      isNewCharacter: true,
      editingCharacter: null
    };
  }

  async function startCharacterCreation(): Promise<void> {
    resetCharacterState();
    router.push('/character/edit');
  }

  async function editCharacter(characterId: number): Promise<void> {
    const character = state.value.characters.find(c => c.id === characterId);
    if (character) {
      state.value.characterState.isNewCharacter = false;
      state.value.characterState.editingCharacter = character;
      router.push('/character/edit');
    }
  }

  async function saveCharacter(): Promise<void> {
    if (!state.value.characterState.editingCharacter) return;

    try {
      if (state.value.characterState.isNewCharacter) {
        await createCharacter(state.value.characterState.editingCharacter);
      } else {
        // Update existing character (to be implemented if needed)
        console.warn('Character update not implemented yet');
      }
      resetCharacterState();
      router.push('/');
    } catch (error) {
      console.error('Failed to save character:', error);
      throw error;
    }
  }

  // Initialize
  async function initialize(): Promise<void> {
    await fetchCharacters();
  }

  return {
    state,
    sortedCharacters,
    fetchCharacters,
    createCharacter,
    uploadCharacterImage,
    setNewCharacter,
    setEditingCharacter,
    resetCharacterState,
    startCharacterCreation,
    editCharacter,
    saveCharacter,
    initialize
  };
});
