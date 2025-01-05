<template>
  <div class="flex items-center space-x-1 bg-catppuccin-surface0/80 backdrop-blur-lg rounded-lg p-1.5 shadow-lg">
    <textarea
      v-model="text"
      @keyup.enter.exact="emit('send')"
      @input="autoGrow"
      placeholder="Type a message..."
      ref="inputRef"
      rows="1"
      class="flex-grow bg-transparent px-3 py-1.5 outline-none resize-none text-sm min-h-[36px] max-h-[80px]"
    ></textarea>
    <button
      @click="emit('send')"
      class="flex-shrink-0 bg-catppuccin-blue/90 p-1.5 rounded-lg text-catppuccin-base hover:bg-catppuccin-sapphire
             transition-colors backdrop-blur-sm">
      <svg xmlns="http://www.w3.org/2000/svg"
           class="h-5 w-5"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  (e: 'send'): void;
  (e: 'update:modelValue', value: string): void;
}>();

const props = defineProps<{
  modelValue: string;
}>();

const inputRef = ref<HTMLTextAreaElement | null>(null);

const text = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

function autoGrow(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = '36px';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>
