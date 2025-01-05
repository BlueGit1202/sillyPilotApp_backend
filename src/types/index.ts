export interface Character {
  id?: number;
  name: string;
  data: CharacterData;
  created_at?: string;
}

export interface CharacterData {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes: string;
  system_prompt: string;
  post_history_instructions: string;
  alternate_greetings: string[];
  character_book?: any;
  tags: string[];
  creator: string;
  character_version: string;
  extensions: Record<string, any>;
  avatar_url?: string;
}

export interface Chat {
  id?: number;
  name: string;
  character_id: number;
  created_at?: string;
  character_name?: string;
  data?: CharacterData;
  last_message?: string;
  last_message_time?: string;
  messages?: Message[];
}

export interface Message {
  id?: number;
  chat_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  image?: string;
  full_response?: string; // Store the complete AI response
}

export interface Settings {
  id?: number;
  aiProvider: 'openrouter' | 'sillytavern';
  sillyTavernIp: string;
  sillyTavernPort: string;
  openRouterApiKey: string;
  theme: string;
  showFullResponses: boolean;
}

export interface OnboardingStatus {
  id?: number;
  completed: boolean;
  current_step: number;
  completed_at?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AppState {
  currentView: 'home' | 'chat' | 'settings' | 'characterEdit';
  chats: Chat[];
  currentChat: Chat | null;
  settings: Settings;
  serverStatus: 'online' | 'offline' | 'checking';
  isDatabaseEmpty: boolean;
  isTyping: boolean;
  showScrollButton: boolean;
  isIdle: boolean;
  idleTime: number;
}

export interface MessageState {
  newMessage: string;
  uploadedImage: string | null;
}

export interface CharacterState {
  isNewCharacter: boolean;
  editingCharacter: Character | null;
}

export interface ThemeColors {
  base: string;
  surface0: string;
  surface1: string;
  surface2: string;
  overlay0: string;
  overlay1: string;
  overlay2: string;
  text: string;
  subtext0: string;
  subtext1: string;
  blue: string;
  lavender: string;
  mauve: string;
  pink: string;
  red: string;
  peach: string;
  yellow: string;
  green: string;
}

export interface Emotion {
  emoji: string;
  name: string;
  description: string;
}

export interface ChatAction {
  type: 'send' | 'regenerate' | 'delete';
  messageId?: number;
  content?: string;
  image?: string;
}

export interface ServerStatus {
  status: 'online' | 'offline';
  timestamp: string;
}

export interface UploadResult {
  success: boolean;
  character?: Character;
  error?: string;
}

export interface ChatUIState {
  showEmojiPicker: boolean;
  showImageUpload: boolean;
  isExpanded: boolean;
  isSending: boolean;
}

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}
