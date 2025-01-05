# SillyPilot (Refactored)

A mobile-first AI companion app for character interactions, built with Vue 3 and TypeScript.

## Key Improvements

1. **Modern Tech Stack**
   - Vue 3 with Composition API
   - TypeScript for type safety
   - Pinia for state management
   - Vite for fast development

2. **Modular Architecture**
   - Separated concerns between frontend and backend
   - Component-based structure
   - Reusable composables and utilities
   - Type-safe API interactions

3. **State Management**
   - Modular Pinia stores
   - Clear separation of concerns
   - Type-safe state mutations
   - Improved error handling

4. **Backend Improvements**
   - Modular service architecture
   - Type-safe database operations
   - Improved error handling
   - Better file organization

5. **UI/UX Maintained**
   - Same Catppuccin theming
   - Mobile-first design
   - Smooth animations and transitions
   - Improved accessibility

## Project Structure

```
new-sillypilot/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   ├── stores/
│   │   ├── app.ts
│   │   ├── chat.ts
│   │   └── character.ts
│   ├── types/
│   │   └── index.ts
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── ChatView.vue
│   │   ├── SettingsView.vue
│   │   └── CharacterEditView.vue
│   ├── App.vue
│   └── main.ts
├── server/
│   ├── config/
│   │   └──corOptions.ts
│   ├── controllers/
│   │   ├── boadingStatus.ts
│   │   ├── character.ts
│   │   ├── chats.ts
│   │   ├── databaseCheck.ts
│   │   ├── factoryReset.ts
│   │   ├── settings.ts
│   │   ├── status.ts
│   │   └── uploadImage.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── api/
│   │       ├── boadingStatus.ts
│   │       ├── character.ts
│   │       ├── chats.ts
│   │       ├── databaseCheck.ts
│   │       ├── factoryReset.ts
│   │       ├── settings.ts
│   │       ├── status.ts
│   │       └── uploadImage.ts   
│   ├── services/
│   │   ├── database.ts
│   │   ├── image.ts
│   │   └── ai-providers/
│   │       ├── openrouter.ts
│   │       └── sillytavern.ts
│   ├── routes/
│   ├── types/
│   │   └── index.ts
│   └── index.ts
└── public/
```

## Features

- **Chat Interface**
  - Real-time message handling
  - Image upload support
  - Message regeneration
  - Idle mode with automatic messaging
  - Emotion detection
  - Scroll management

- **Character Management**
  - Character creation and editing
  - Character card import
  - Avatar upload system
  - Detailed character metadata
  - SillyTavern compatibility

- **Settings**
  - Multiple AI provider support
  - Theme customization
  - Server connection management
  - Status monitoring

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Providers

- **OpenRouter**
  - Direct API integration
  - Character card injection
  - Response processing

- **SillyTavern**
  - STAHP plugin integration
  - Connection management
  - Character format compatibility

## Mobile Support

The app is designed with a mobile-first approach:
- Responsive layouts
- Touch-friendly interactions
- Optimized performance
- Efficient resource loading

## Theme

Uses the Catppuccin color scheme with support for multiple variants:
- Mocha (default)
- Macchiato
- Frappé
- Latte

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
