# SillyPilot Onboarding Flow

## Database Check & New User Detection

```javascript
// server.js - Initial database check
async function checkDatabaseState() {
  const tables = ['users', 'characters', 'chats', 'messages', 'settings'];
  const isEmpty = await Promise.all(tables.map(async (table) => {
    const count = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
    return count.count === 0;
  }));
  
  return isEmpty.every(empty => empty);
}

// Vue component - Check for new user
async mounted() {
  try {
    const response = await axios.get('/api/check-database');
    if (response.data.isEmpty) {
      this.currentView = 'onboarding';
      this.onboardingStep = 1;
    }
  } catch (error) {
    console.error('Error checking database state:', error);
  }
}
```

## Factory Reset Implementation

```javascript
// server.js - Factory reset endpoint
app.post('/api/factory-reset', async (req, res) => {
  try {
    // Backup current database (optional)
    await backupDatabase();
    
    // Drop all tables
    await db.run('DROP TABLE IF EXISTS users');
    await db.run('DROP TABLE IF EXISTS characters');
    await db.run('DROP TABLE IF EXISTS chats');
    await db.run('DROP TABLE IF EXISTS messages');
    await db.run('DROP TABLE IF EXISTS settings');
    
    // Reinitialize database with schema
    await initializeDatabase();
    
    // Clear uploads directory
    await fs.promises.rm('./uploads', { recursive: true, force: true });
    await fs.promises.mkdir('./uploads');
    
    res.json({ success: true, message: 'Factory reset complete' });
  } catch (error) {
    console.error('Factory reset error:', error);
    res.status(500).json({ error: 'Failed to perform factory reset' });
  }
});

// Vue component - Factory reset button in settings
methods: {
  async performFactoryReset() {
    if (await this.confirmReset()) {
      try {
        await axios.post('/api/factory-reset');
        this.currentView = 'onboarding';
        this.onboardingStep = 1;
      } catch (error) {
        console.error('Factory reset error:', error);
      }
    }
  },
  
  confirmReset() {
    return new Promise((resolve) => {
      // Custom modal implementation
      this.showModal({
        title: 'Factory Reset',
        message: 'This will delete all your chats, characters, and settings. Are you sure?',
        confirmText: 'Reset Everything',
        cancelText: 'Keep My Data',
        type: 'danger',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  }
}
```

## Onboarding Flow Screens

### 1. Welcome Screen
```html
<template>
  <div class="onboarding-screen welcome" v-if="onboardingStep === 1">
    <div class="welcome-content">
      <h1 class="text-3xl font-bold mb-6">Welcome to Your AI Companion</h1>
      <p class="text-lg mb-8">Let's get you set up with your perfect companion.</p>
      
      <div class="feature-grid">
        <div class="feature-card">
          <span class="feature-icon">💭</span>
          <h3>Natural Conversations</h3>
          <p>Chat naturally with advanced AI companions</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎭</span>
          <h3>Custom Characters</h3>
          <p>Create and customize your own companions</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔄</span>
          <h3>Seamless Sync</h3>
          <p>Your conversations are always in sync</p>
        </div>
      </div>

      <button 
        @click="nextStep"
        class="primary-button mt-8"
      >
        Get Started
      </button>
    </div>
  </div>
</template>

<style scoped>
.welcome-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--ctp-surface0);
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>
```

### 2. AI Provider Setup
```html
<template>
  <div class="onboarding-screen provider-setup" v-if="onboardingStep === 2">
    <div class="setup-content">
      <h2 class="text-2xl font-bold mb-6">Choose Your AI Provider</h2>
      
      <div class="provider-options">
        <div 
          class="provider-card"
          :class="{ active: selectedProvider === 'openrouter' }"
          @click="selectProvider('openrouter')"
        >
          <img src="/icons/openrouter.svg" alt="OpenRouter" class="provider-logo">
          <h3>OpenRouter</h3>
          <p>Access multiple AI models through one API</p>
        </div>
        
        <div 
          class="provider-card"
          :class="{ active: selectedProvider === 'sillytavern' }"
          @click="selectProvider('sillytavern')"
        >
          <img src="/icons/sillytavern.svg" alt="SillyTavern" class="provider-logo">
          <h3>SillyTavern</h3>
          <p>Connect to your local SillyTavern instance</p>
        </div>
      </div>

      <div class="provider-setup-form" v-if="selectedProvider">
        <template v-if="selectedProvider === 'openrouter'">
          <input 
            type="password"
            v-model="apiKey"
            placeholder="Enter your OpenRouter API key"
            class="api-input"
          >
          <a href="https://openrouter.ai/keys" target="_blank" class="text-sm text-blue-400">
            Get an API key
          </a>
        </template>

        <template v-if="selectedProvider === 'sillytavern'">
          <input 
            type="text"
            v-model="serverIP"
            placeholder="Server IP address"
            class="api-input"
          >
          <input 
            type="text"
            v-model="serverPort"
            placeholder="Server port"
            class="api-input mt-4"
          >
        </template>
      </div>

      <div class="navigation-buttons">
        <button 
          @click="prevStep"
          class="secondary-button"
        >
          Back
        </button>
        <button 
          @click="nextStep"
          class="primary-button"
          :disabled="!isProviderConfigValid"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.provider-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.provider-card {
  background: var(--ctp-surface0);
  padding: 2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.provider-card.active {
  border-color: var(--ctp-blue);
  background: var(--ctp-surface1);
}

.provider-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.api-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--ctp-surface0);
  border: 1px solid var(--ctp-overlay0);
  border-radius: 8px;
  margin-top: 1rem;
}
</style>
```

### 3. Character Creation
```html
<template>
  <div class="onboarding-screen character-creation" v-if="onboardingStep === 3">
    <div class="creation-content">
      <h2 class="text-2xl font-bold mb-6">Create Your First Companion</h2>
      
      <div class="character-form">
        <div class="avatar-upload">
          <img 
            :src="avatarPreview || '/default-avatar.png'" 
            alt="Character avatar"
            class="avatar-preview"
          >
          <button 
            @click="triggerAvatarUpload"
            class="upload-button"
          >
            Upload Image
          </button>
          <input 
            type="file"
            ref="avatarInput"
            @change="handleAvatarUpload"
            accept="image/*"
            class="hidden"
          >
        </div>

        <div class="form-fields">
          <div class="form-group">
            <label>Name</label>
            <input 
              v-model="character.name"
              type="text"
              placeholder="Enter character name"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Personality</label>
            <textarea 
              v-model="character.personality"
              placeholder="Describe your character's personality..."
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Scenario</label>
            <textarea 
              v-model="character.scenario"
              placeholder="Set the initial scenario..."
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>First Message</label>
            <textarea 
              v-model="character.first_message"
              placeholder="What should they say first?"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <button 
          @click="prevStep"
          class="secondary-button"
        >
          Back
        </button>
        <button 
          @click="createCharacter"
          class="primary-button"
          :disabled="!isCharacterValid"
        >
          Create Companion
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-form {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.avatar-upload {
  text-align: center;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--ctp-surface0);
  border: 1px solid var(--ctp-overlay0);
  border-radius: 8px;
  resize: vertical;
}
</style>
```

### 4. Completion & Tutorial
```html
<template>
  <div class="onboarding-screen completion" v-if="onboardingStep === 4">
    <div class="completion-content">
      <div class="success-animation">
        <span class="success-icon">✨</span>
      </div>

      <h2 class="text-2xl font-bold mb-6">All Set!</h2>
      <p class="text-lg mb-8">Your companion is ready to chat. Here's a quick tour of the features:</p>

      <div class="tutorial-steps">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Send Messages</h4>
            <p>Type your message and hit enter or click the send button</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Share Images</h4>
            <p>Click the image icon to share pictures in your chat</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Character Settings</h4>
            <p>Customize your companion's behavior in settings</p>
          </div>
        </div>
      </div>

      <button 
        @click="startChatting"
        class="primary-button mt-8"
      >
        Start Chatting
      </button>
    </div>
  </div>
</template>

<style scoped>
.completion-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.success-animation {
  margin: 2rem 0;
}

.success-icon {
  font-size: 4rem;
  animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
}

.tutorial-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ctp-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@keyframes successPop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
```

## Onboarding State Management

```javascript
// Vue component state
data() {
  return {
    onboardingStep: 1,
    selectedProvider: null,
    apiKey: '',
    serverIP: '',
    serverPort: '',
    character: {
      name: '',
      avatar: null,
      personality: '',
      scenario: '',
      first_message: ''
    }
  }
},

computed: {
  isProviderConfigValid() {
    if (this.selectedProvider === 'openrouter') {
      return this.apiKey.length > 0;
    }
    if (this.selectedProvider === 'sillytavern') {
      return this.serverIP.length > 0 && this.serverPort.length > 0;
    }
    return false;
  },

  isCharacterValid() {
    return (
      this.character.name.length > 0 &&
      this.character.personality.length > 0 &&
      this.character.scenario.length > 0 &&
      this.character.first_message.length > 0
    );
  }
},

methods: {
  nextStep() {
    if (this.onboardingStep < 4) {
      this.onboardingStep++;
    }
  },

  prevStep() {
    if (this.onboardingStep > 1) {
      this.onboardingStep--;
    }
  },

  async createCharacter() {
    try {
      const formData = new FormData();
      Object.keys(this.character).forEach(key => {
        formData.append(key, this.character[key]);
      });

      const response = await axios.post('/api/characters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.nextStep();
    } catch (error) {
      console.error('Error creating character:', error);
    }
  },

  async startChatting() {
    this.currentView = 'chat';
  }
}
```

## Database Schema Updates

```sql
-- Add onboarding status table
CREATE TABLE IF NOT EXISTS onboarding_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  completed BOOLEAN DEFAULT 0,
  completed_at TIMESTAMP,
  current_step INTEGER DEFAULT 1
);

-- Add factory reset tracking
CREATE TABLE IF NOT EXISTS system_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  event_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Factory Reset Button Implementation

```html
<!-- Add to settings screen -->
<div class="danger-zone mt-8 p-4 border-2 border-red-500 rounded-lg">
  <h3 class="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
  
  <div class="flex items-center justify-between">
    <div>
      <h4 class="font-medium">Factory Reset</h4>
      <p class="text-sm text-gray-400">
        Delete all data and start fresh. This cannot be undone.
      </p>
    </div>
    
    <button 
      @click="performFactoryReset"
      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Reset Everything
    </button>
  </div>
</div>

<!-- Factory reset confirmation modal -->
<modal 
  v-if="showResetModal"
  @close="showResetModal = false"
>
  <template #header>
    <h3 class="text-xl font-bold">Factory Reset</h3>
  </template>
  
  <template #body>
    <p class="mb-4">
      This will permanently delete:
    </p>
    <ul class="list-disc ml-6 mb-4">
      <li>All your characters</li>
      <li>All chat history</li>
      <li>All settings and preferences</li>
      <li>All uploaded images</li>
    </ul>
    <p class="font-bold text-red-500">
      This action cannot be undone.
    </p>
  </template>
  
  <template #footer>
    <button 
      @click="showResetModal = false"
      class="secondary-button"
    >
      Cancel
    </button>
    <button 
      @click="confirmFactoryReset"
      class="danger-button"
    >
      Yes, Reset Everything
    </button>
  </template>
</modal>
```

## Implementation Steps

1. Database Updates
   - Add new tables for onboarding and system events
   - Create migration script for existing installations

2. Backend Implementation
   - Add database state check endpoint
   - Implement factory reset functionality
   - Add character creation endpoints

3. Frontend Changes
   - Create onboarding view components
   - Add factory reset UI to settings
   - Implement step navigation

4. Testing
   - Verify database checks
   - Test factory reset functionality
   - Validate onboarding flow
   - Check mobile responsiveness

5. Documentation
   - Update API documentation
   - Add onboarding flow diagrams
   - Document factory reset process

The onboarding flow provides a smooth introduction to the app while the factory reset option allows users to start fresh when needed. All components maintain the existing Catppuccin theme and mobile-first design approach.
