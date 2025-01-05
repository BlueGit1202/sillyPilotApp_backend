import { Router } from 'express';
import { database } from '../../services/database';
import { APIResponse, Chat, Message } from '../../types';
import { AIProviderFactory } from '../../services/ai-providers';
import { createchat, createChatMessage, getChatById, getChats } from '../../controllers/chats';

const router = Router();

// Create a new chat
router.post('/', createchat);
router.get('/', getChats);
router.get('/:id',getChatById);
router.post('/:id/messages', createChatMessage);

export default router;
