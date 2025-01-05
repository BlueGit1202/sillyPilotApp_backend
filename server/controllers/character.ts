import { APIResponse, Character } from "../../server/types";
import { database } from "../services/database";
import { Request,Response,NextFunction } from "express";


export const getCharacters =async (req:Request, res:Response, next:NextFunction) => {
    try {
        const characters = await database.getCharacters();
        res.json({ success: true, data: characters } as APIResponse<Character[]>);
    } catch (error) {
        next(error);
    }
}

export const createCharacter=async (req:Request, res:Response, next:NextFunction) => {
    try {
        const character = await database.createCharacter(req.body as Character);
        res.status(201).json({ success: true, data: character } as APIResponse<Character>);
    } catch (error) {
        next(error);
    }
}