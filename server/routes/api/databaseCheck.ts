import { checkDatabase } from '../../controllers/databaseCheck';
import { Router } from 'express';


const router = Router();

router.get('/', checkDatabase);

export default router;
