import express from 'express';
import JWTVERIFY from '../../middleware/jwtAuth';
import homeController from '../../controllers/socialNetwork/homeController';

const router = express.Router();
router.get('/', homeController.getPost);
router.post('/upPost', homeController.setPost);
export default router;
