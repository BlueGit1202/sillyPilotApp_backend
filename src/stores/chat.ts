import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Chat, Message, ChatAction, MessageState, ErrorState } from '../types';
import axios from 'axios';
import { useAppStore } from './app';

export const useChatStore = defineStore('chat', () => {
  const router = useRouter();
  const appStore = useAppStore();
  
  const state = ref<{
    chats: Chat[];
    currentChat: Chat | null;
    messageState: MessageState;
    error: ErrorState | null;
    idleInterval: number | null;
  }>({
    chats: [],
    currentChat: null,
    messageState: {
      newMessage: '',
      uploadedImage: null
    },
    error: null,
    idleInterval: null
  });

  // Getters
  const sortedChats = computed(() => {
    return [...state.value.chats].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  });

  const currentMessages = computed(() => state.value.currentChat?.messages || []);

  // Actions
  async function fetchChats(): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: Chat[] }>('/api/chats');
      if (response.data.success) {
        state.value.chats = response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setError('Failed to fetch chats', 'error');
    }
  }

  async function openChat(chatId: number): Promise<void> {
    try {
      const response = await axios.get<{ success: boolean; data: Chat }>(`/api/chats/${chatId}`);
      if (response.data.success) {
        state.value.currentChat = response.data.data;
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to open chat:', error);
      setError('Failed to open chat', 'error');
    }
  }

  async function createChat(characterId: number, name: string): Promise<void> {
    try {
      const response = await axios.post<{ success: boolean; data: Chat }>('/api/chats', {
        character_id: characterId,
        name
      });
      
      if (response.data.success) {
        state.value.chats.unshift(response.data.data);
        state.value.currentChat = response.data.data;
        await fetchChats(); // Refresh chat list
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError('Failed to create chat', 'error');
    }
  }

  function formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  async function sendMessage(content: string, image?: string): Promise<void> {
    if (!state.value.currentChat) return;
    
    try {
      appStore.setIsTyping(true);
      
      const response = await axios.post<{
        success: boolean;
        data: { userMessage: Message; assistantMessage: Message; fullResponse?: string };
      }>(`/api/chats/${state.value.currentChat.id}/messages`, {
        message: content,
        image
      });

      if (response.data.success && state.value.currentChat) {
        const { userMessage, assistantMessage, fullResponse } = response.data.data;
        
        // Add timestamp to messages
        const now = new Date();
        userMessage.timestamp = formatTimestamp(now);
        assistantMessage.timestamp = formatTimestamp(now);
        
        // Store full response if available
        if (fullResponse) {
          assistantMessage.full_response = fullResponse;
        }

        state.value.currentChat.messages = [
          ...(state.value.currentChat.messages || []),
          userMessage,
          assistantMessage
        ];
        
        // Update last message in chat list
        const chatIndex = state.value.chats.findIndex(c => c.id === state.value.currentChat?.id);
        if (chatIndex !== -1) {
          state.value.chats[chatIndex].last_message = assistantMessage.content;
          state.value.chats[chatIndex].last_message_time = formatTimestamp(now);
        }
        await fetchChats(); // Refresh chat list
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message', 'error');
    } finally {
      appStore.setIsTyping(false);
      clearMessage();
    }
  }

  async function regenerateMessage(messageId: number): Promise<void> {
    if (!state.value.currentChat) return;
    
    try {
      appStore.setIsTyping(true);
      
      const messages = state.value.currentChat.messages || [];
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return;

      const response = await axios.post<{
        success: boolean;
        data: { userMessage: Message; assistantMessage: Message; fullResponse?: string };
      }>(`/api/chats/${state.value.currentChat.id}/messages`, {
        message: messages[messageIndex].content,
        regenerate: true
      });

      if (response.data.success && state.value.currentChat) {
        const { assistantMessage, fullResponse } = response.data.data;
        
        // Add timestamp
        assistantMessage.timestamp = formatTimestamp(new Date());
        
        // Store full response if available
        if (fullResponse) {
          assistantMessage.full_response = fullResponse;
        }

        // Replace the old assistant message with the new one
        state.value.currentChat.messages = [
          ...messages.slice(0, messageIndex + 1),
          assistantMessage
        ];
        await fetchChats(); // Refresh chat list
      }
    } catch (error) {
      console.error('Failed to regenerate message:', error);
      setError('Failed to regenerate message', 'error');
    } finally {
      appStore.setIsTyping(false);
    }
  }

  function setMessage(message: string): void {
    state.value.messageState.newMessage = message;
  }

  function setUploadedImage(imageData: string | null): void {
    state.value.messageState.uploadedImage = imageData;
  }

  function clearMessage(): void {
    state.value.messageState.newMessage = '';
    state.value.messageState.uploadedImage = null;
  }

  function setError(message: string, type: ErrorState['type']): void {
    state.value.error = {
      message,
      type,
      timestamp: formatTimestamp(new Date())
    };
  }

  function clearError(): void {
    state.value.error = null;
  }

  function generateIdlePrompt(): string {
    const character = state.value.currentChat?.data;
    if (!character) return '';

    // Get the last few messages for context
    const recentMessages = state.value.currentChat?.messages?.slice(-3) || [];
    const lastMessage = recentMessages[recentMessages.length - 1]?.content || '';

    // Extract topics from recent conversation
    const topics = lastMessage
      .split(/[.,!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Get character's personality traits
    const traits = character.personality
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Create natural conversation continuations based on character's personality
    const continuations = [
      // If there are recent topics, reference them
      ...(topics.length > 0 ? [
        `${character.name} thinks about ${topics[0].toLowerCase()} and, being ${traits[0] || 'themselves'}, continues...`,
        `The conversation about ${topics[0].toLowerCase()} reminds ${character.name} of something...`,
        `${character.name}'s ${traits[0] || 'unique'} perspective on ${topics[0].toLowerCase()} leads them to add...`
      ] : []),
      
      // General personality-driven continuations
      ...(traits.length > 0 ? [
        `Being ${traits[0]}, ${character.name} can't help but share their thoughts...`,
        `${character.name}'s ${traits[0]} nature prompts them to continue the conversation...`,
        `True to their ${traits[0]} personality, ${character.name} speaks up...`
      ] : []),
      
      // Scenario-based continuations
      ...(character.scenario ? [
        `In this moment of ${character.scenario}, ${character.name} continues...`,
        `The current situation reminds ${character.name} of something relevant...`
      ] : []),
      
      // Fallback options
      `${character.name} continues the conversation naturally...`,
      `${character.name} shares their thoughts...`,
      `${character.name} adds to the discussion...`
    ];

    return continuations[Math.floor(Math.random() * continuations.length)];
  }

  function startIdleMode(): void {
    if (state.value.idleInterval) return;
    
    state.value.idleInterval = window.setInterval(() => {
      if (state.value.currentChat) {
        const idlePrompt = generateIdlePrompt();
        if (idlePrompt) {
          sendMessage(idlePrompt);
        }
      }
    }, appStore.state.idleTime * 60000);
  }

  function stopIdleMode(): void {
    if (state.value.idleInterval) {
      clearInterval(state.value.idleInterval);
      state.value.idleInterval = null;
    }
  }

  // Cleanup
  function reset(): void {
    state.value = {
      chats: [],
      currentChat: null,
      messageState: {
        newMessage: '',
        uploadedImage: null
      },
      error: null,
      idleInterval: null
    };
  }

  return {
    state,
    sortedChats,
    currentMessages,
    fetchChats,
    openChat,
    createChat,
    sendMessage,
    regenerateMessage,
    setMessage,
    setUploadedImage,
    clearMessage,
    setError,
    clearError,
    startIdleMode,
    stopIdleMode,
    reset
  };
});
