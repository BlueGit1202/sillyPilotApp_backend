import { APIResponse,  OnboardingStatus } from "../types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";


export const factoryReset =async (req:Request, res:Response, next:NextFunction) => {
  try {
        await database.factoryReset();
        res.json({ 
            success: true, 
            data: {
                message: 'Factory reset complete',
                onboardingStatus: { completed: false, current_step: 1 }
            }
        });
    } catch (error) {
        next(error);
    }
}