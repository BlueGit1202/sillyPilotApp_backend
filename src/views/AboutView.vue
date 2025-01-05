<template>
  <div class="flex flex-col h-full p-4 space-y-6 overflow-y-auto scrollbar-hide">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-catppuccin-lavender">About SillyPilot</h1>
      <p class="text-catppuccin-text">An AI companion app for character interactions</p>
    </div>

    <!-- Version Info -->
    <div class="bg-catppuccin-surface0 rounded-lg p-6 space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-catppuccin-text">Version</span>
        <span class="text-catppuccin-sky">1.0.0</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-catppuccin-text">Build Date</span>
        <span class="text-catppuccin-sky">{{ buildDate }}</span>
      </div>
    </div>

    <!-- Credits -->
    <div class="bg-catppuccin-surface0 rounded-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold text-catppuccin-lavender">Credits</h2>
      
      <!-- Developer -->
      <div class="space-y-2">
        <h3 class="text-lg text-catppuccin-mauve">Developer</h3>
        <a href="https://github.com/DobieDev" 
           target="_blank"
           class="flex items-center space-x-3 p-3 bg-catppuccin-surface1 rounded-lg
                  hover:bg-catppuccin-surface2 transition-colors">
          <img src="https://github.com/DobieDev.png" 
               alt="Dobie Dev"
               class="w-12 h-12 rounded-full ring-2 ring-catppuccin-blue">
          <div>
            <p class="text-catppuccin-text font-medium">Dobie Dev</p>
            <p class="text-catppuccin-subtext0 text-sm">Lead Developer & Creator</p>
          </div>
        </a>
      </div>

      <!-- Technologies -->
      <div class="space-y-2">
        <h3 class="text-lg text-catppuccin-mauve">Built With</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-catppuccin-surface1 p-3 rounded-lg">
            <p class="text-catppuccin-text font-medium">Vue.js</p>
            <p class="text-catppuccin-subtext0 text-sm">Frontend Framework</p>
          </div>
          <div class="bg-catppuccin-surface1 p-3 rounded-lg">
            <p class="text-catppuccin-text font-medium">TypeScript</p>
            <p class="text-catppuccin-subtext0 text-sm">Language</p>
          </div>
          <div class="bg-catppuccin-surface1 p-3 rounded-lg">
            <p class="text-catppuccin-text font-medium">Tailwind CSS</p>
            <p class="text-catppuccin-subtext0 text-sm">Styling</p>
          </div>
          <div class="bg-catppuccin-surface1 p-3 rounded-lg">
            <p class="text-catppuccin-text font-medium">Node.js</p>
            <p class="text-catppuccin-subtext0 text-sm">Backend Runtime</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Links -->
    <div class="bg-catppuccin-surface0 rounded-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold text-catppuccin-lavender">Links</h2>
      <div class="space-y-2">
        <a href="https://github.com/DobieDev/SillyPilot" 
           target="_blank"
           class="flex items-center justify-between p-3 bg-catppuccin-surface1 rounded-lg
                  hover:bg-catppuccin-surface2 transition-colors">
          <span class="text-catppuccin-text">GitHub Repository</span>
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 text-catppuccin-sky" 
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const buildDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
</script>
