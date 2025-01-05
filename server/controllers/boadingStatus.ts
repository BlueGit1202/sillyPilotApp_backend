import { APIResponse,  OnboardingStatus } from "../types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";


export const boardingStatus =async (req:Request, res:Response, next:NextFunction) => {
   try {
        const status = await database.updateOnboardingStatus(req.body as OnboardingStatus);
        res.json({ success: true, data: status } as APIResponse<OnboardingStatus>);
    } catch (error) {
        next(error);
    }
}

