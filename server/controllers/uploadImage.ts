import multer from 'multer';
import { APIResponse,  Character } from "../types";
import { Request,Response,NextFunction } from "express";
import { promises as fs } from 'node:fs';
import { imageProcessor } from '../services/image';



export const uploadImage =async (req:Request, res:Response, next:NextFunction) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

    const character = await imageProcessor.processCharacterImage(req.file.path);

        await fs.unlink(req.file.path);
        
        res.json({ success: true, data: character } as APIResponse<Character>);
    } catch (error) {
        next(error);
    }
}