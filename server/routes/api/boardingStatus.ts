
import { boardingStatus } from '../../controllers/boadingStatus';
import { database } from '../../services/database';
import { APIResponse, Character, OnboardingStatus } from '../../types';
import { Router } from 'express';


const router = Router();


router.post('/', boardingStatus);
export default router;
