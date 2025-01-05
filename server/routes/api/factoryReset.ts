
import { factoryReset } from '../../controllers/factoryReset';
import { Router } from 'express';


const router = Router();

router.post('/', factoryReset);
export default router;
