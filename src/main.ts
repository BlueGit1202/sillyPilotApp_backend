import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './assets/main.css';
import { HomeView, ChatView, SettingsView, CharacterEditView } from './views';
import BrowseCharactersView from './views/BrowseCharactersView.vue';
import AboutView from './views/AboutView.vue';

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      component: HomeView,
      name: 'home'
    },
    { 
      path: '/chat', 
      component: ChatView,
      name: 'chat'
    },
    { 
      path: '/settings', 
      component: SettingsView,
      name: 'settings'
    },
    { 
      path: '/character/edit', 
      component: CharacterEditView,
      name: 'character-edit'
    },
    {
      path: '/browse',
      component: BrowseCharactersView,
      name: 'browse'
    },
    {
      path: '/about',
      component: AboutView,
      name: 'about'
    }
  ]
});

// Create app instance
const app = createApp(App);

// Setup Pinia
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Mount app
app.mount('#app');
