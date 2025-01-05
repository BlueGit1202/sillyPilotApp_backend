import { imageProcessor } from '../../services/image';
import { APIResponse, Character, OnboardingStatus } from '../../types';

import multer from 'multer';
import { Router } from 'express';
import { uploadImage } from '../../controllers/uploadImage';


const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/',upload.single("avatar"), uploadImage);
export default router;
