import { Router } from 'express';
import chatRoutes from './api/chats';
import settingRoutes from './api/settings';
import characterRoutes from './api/characters';
import checkDatabaseRoute from './api/databaseCheck';
import uploadImageRoute from './api/uploadImage';
import boardingStatusRoute from './api/boardingStatus';
import factoryResetRoute from './api/factoryReset';
import statusRoute from './api/status';


const router = Router();

router.use('/chats', chatRoutes);
router.use('/settings',settingRoutes);
router.use('/characters', characterRoutes);
router.use('/check-database',checkDatabaseRoute);
router.use('/characters/upload-avatar',uploadImageRoute);
router.use('/onboarding/status',boardingStatusRoute);
router.use('/factory-reset',factoryResetRoute);
router.use('/status',statusRoute);
export default router;