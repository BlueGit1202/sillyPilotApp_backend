import { APIResponse, Character, Settings } from "../types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";


export const getSettings =async (req:Request, res:Response, next:NextFunction) => {
    try {
            const settings = await database.getSettings();
            res.json({ success: true, data: settings } as APIResponse<Settings>);
        } catch (error) {
            next(error);
        }
    }

export const updateSettings=async (req:Request, res:Response, next:NextFunction) => {
   try {
        const settings = await database.updateSettings(req.body as Settings);
        res.json({ success: true, data: settings } as APIResponse<Settings>);
    } catch (error) {
        next(error);
    }
}