import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import homeController from '../../controllers/socialNetwork/homeController';

const router = express.Router();
router.get('/', homeController.getHome);
export default router;
