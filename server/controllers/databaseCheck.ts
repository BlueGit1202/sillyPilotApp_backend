import { APIResponse,  OnboardingStatus } from "../types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";


export const checkDatabase =async (req:Request, res:Response, next:NextFunction) => {
  try {
        const tables = ['characters', 'chats', 'messages', 'settings'];
        const isEmpty = await Promise.all(tables.map(async (table) => {
            const count = await database.db?.get(`SELECT COUNT(*) as count FROM ${table}`);
            return count?.count === 0;
        }));
        
        const isNewUser = isEmpty.every(empty => empty);
        const onboardingStatus = await database.db?.get('SELECT * FROM onboarding_status ORDER BY id DESC LIMIT 1');
        
        res.json({ 
            success: true,
            data: {
                isEmpty: isNewUser,
                onboardingStatus: onboardingStatus || { completed: false, current_step: 1 }
            }
        } as APIResponse<{ isEmpty: boolean; onboardingStatus: OnboardingStatus }>);
    } catch (error) {
        next(error);
    }
}

