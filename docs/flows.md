# SillyPilot Technical Overview

## Core Architecture
- Vue.js frontend application
- Express.js backend (implied by API endpoints)
- SQLite database for persistent storage
- Support for multiple AI providers (OpenRouter, SillyTavern)
- Mobile-first responsive design

## Current Features

### Authentication & Settings
- Settings management for AI provider configuration
- OpenRouter API key storage
- SillyTavern connection settings (IP/Port)
- Server status monitoring (60-second interval checks)

### Character Management
- Character creation and editing
- Character avatar upload support
- Character metadata storage (personality, scenario, etc.)
- Character card format compatible with SillyTavern

### Chat Interface
1. Home Screen
   - List of active chats
   - Character avatars
   - Last message timestamps
   - Navigation to settings
   - Create new chat option

2. Chat Screen
   - Message history display
   - Real-time message sending
   - Image upload support
   - Typing indicators
   - Message regeneration
   - Idle mode with timed messages
   - Scroll to bottom functionality
   - Expandable text input
   - Mood detection system
   - Emotion detection in messages

3. Settings Screen
   - AI provider selection
   - Server configuration
   - Theme selection (Catppuccin support)
   - Connection testing

## Data Flow

### Message Processing
1. User sends message
   ```
   User Input -> Frontend validation -> API request -> AI Provider -> Response -> UI Update
   ```

2. Character Creation
   ```
   Character Form -> Image Upload -> Character Data Storage -> Chat Creation -> Chat Interface
   ```

3. Settings Management
   ```
   Settings Input -> Validation -> API Storage -> Connection Test -> Status Update
   ```

## Missing Components

### Critical Features
1. Authentication System
   - User accounts
   - Session management
   - Access control

2. Error Handling
   - Comprehensive error messages
   - Offline mode support
   - Connection retry logic

3. Data Management
   - Chat history export
   - Character backup/restore
   - Message search functionality

### User Experience
1. Notifications
   - Push notification system
   - Message alerts
   - Connection status alerts

2. Media Support
   - Voice messages
   - File attachments
   - Image gallery

3. Chat Features
   - Message editing
   - Message deletion
   - Chat archiving
   - Chat categories/folders

### Technical Debt
1. Performance
   - Message pagination
   - Image optimization
   - Cache management

2. Testing
   - Unit tests
   - Integration tests
   - E2E testing

3. Documentation
   - API documentation
   - Setup guide
   - Deployment instructions

## Integration Points

### OpenRouter Integration
- API key management
- Character card injection
- Response processing
- Error handling

### SillyTavern Integration
- STAHP plugin dependency
- Connection management
- Character format compatibility
- Message synchronization

## Future Considerations
1. Multi-device sync
2. Offline support
3. End-to-end encryption
4. Character sharing marketplace
5. Voice interaction
6. Custom themes support
7. Plugin system
8. Analytics and usage tracking
