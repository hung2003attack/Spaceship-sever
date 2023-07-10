import express from 'express';
import JWTVERIFY from '../../../middleware/jwtAuth';
import homeController from '../../../controllers/websController/socialNetwork/homeController';
import { upload } from '../../../middleware/uploadGridFS';

const router = express.Router();
router.get('/', homeController.getPost);
router.post('/setPost', upload.array('files'), homeController.setPost);
router.post('/expireChunks', homeController.expireChunks);
export default router;
