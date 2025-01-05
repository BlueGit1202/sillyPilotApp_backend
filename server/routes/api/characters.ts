import { createCharacter, getCharacters } from '../../controllers/character';
import { Router } from 'express';


const router = Router();

router.post('/', createCharacter);

router.get('/', getCharacters);

export default router;
