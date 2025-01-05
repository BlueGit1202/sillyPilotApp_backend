import { APIResponse, Character, Chat, Message } from "../types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";
import { AIProviderFactory } from "../services/ai-providers";


export const getChats =async (req:Request, res:Response, next:NextFunction) =>  {
    try {
        const chats = await database.getChats();
        res.json({ success: true, data: chats } as APIResponse<Chat[]>);
    } catch (error) {
        next(error);
    }
}

export const createchat=async (req:Request, res:Response, next:NextFunction) => {
     try {
         const chat = await database.createChat(req.body as Chat);
        res.status(201).json({ success: true, data: chat } as APIResponse<Chat>);
    } catch (error) {
        next(error);
    }
}

export const getChatById =async (req:Request, res:Response, next:NextFunction) =>  {
   try {
        const chat = await database.getChat(parseInt(req.params.id));
        if(chat)
        res.status(200).json({ success: true, data: chat } as APIResponse<Chat>);
    else 
        res.status(400).json({success:false});
    } catch (error) {
        next(error);
    }
}

export const createChatMessage=async (req:Request, res:Response, next:NextFunction) => {
     try {
            const chatId = parseInt(req.params.id);
         const { content, image } = req.body;
         const message = content;
            
            const chat = await database.getChat(chatId);
            
            const aiProvider = await AIProviderFactory.createProvider();
            // Save user message
            const userMessage = await database.createMessage({
                chat_id: chatId,
                role: 'user',
                content: message,
                image
            } as Message);
    
            // Get AI response
            const aiResponse = await aiProvider.sendMessage(message, chat);
            // Save AI response
            const assistantMessage = await database.createMessage({
                chat_id: chatId,
                role: 'assistant',
                content: aiResponse
            } as Message);
    
            res.json({
                success: true,
                data: {
                    userMessage,
                    assistantMessage
                }
            } as APIResponse<{ userMessage: Message; assistantMessage: Message }>);
        } catch (error) {
            next(error);
        }
    }